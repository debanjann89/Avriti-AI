"""
Virtual Try-On Router
Exposes the end-to-end try-on pipeline as REST endpoints.
"""

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Literal, Optional
from sqlalchemy.orm import Session
from database import get_db
import models

from services.gemini_service import analyze_garment, build_tryon_prompt
from services.hf_service import generate_tryon_image, generate_tryon_variants

router = APIRouter()

ALLOWED_TYPES = ("image/jpeg", "image/png", "image/webp")


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/generate")
async def generate_tryon(
    garment_image: UploadFile = File(..., description="Garment photo (JPG/PNG/WEBP)"),
    garment_back_image: Optional[UploadFile] = File(None, description="Optional: Back view garment photo (JPG/PNG/WEBP)"),
    person_image: Optional[UploadFile] = File(None, description="Optional: photo of the person to wear the garment"),
    age_group: str = Form("Young Adult"),
    ethnicity: str = Form("South Asian"),
    body_type: str = Form("Average"),
    gender: str = Form("Woman"),
    camera_angles: str = Form("Front View"),
    backdrop_scene: str = Form("Minimalist Studio"),
    garment_category: Optional[str] = Form(None),
    garment_subcategory: Optional[str] = Form(None),
    garment_description: Optional[str] = Form(None),
):
    """
    Full try-on pipeline:
    1. Gemini analyzes the garment image (front/back depending on angle) with category hints
    2. Builds a hyperrealistic prompt
    3. HF generates try-on image(s) for each selected camera angle using the corresponding garment image
    4. Returns base64 images + metadata
    """
    if garment_image.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPG/PNG/WEBP images accepted.")

    garment_bytes = await garment_image.read()

    # Read back garment image if provided
    garment_back_bytes: bytes | None = None
    if garment_back_image and garment_back_image.content_type in ALLOWED_TYPES:
        garment_back_bytes = await garment_back_image.read()

    # Read person image if provided
    person_bytes: bytes | None = None
    if person_image and person_image.content_type in ALLOWED_TYPES:
        person_bytes = await person_image.read()

    # Step 1: Analyze front garment with Gemini Vision and category/subcategory/description hints
    try:
        garment_data = await analyze_garment(
            garment_bytes, 
            garment_image.content_type,
            hint_category=garment_subcategory or garment_category,
            hint_description=garment_description
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini front analysis failed: {e}")

    # Analyze back garment if provided and a back view angle is selected
    garment_back_data = None
    angles_list = [a.strip() for a in camera_angles.split(",") if a.strip()]
    has_back_angle = any("back" in a.lower() for a in angles_list)
    if garment_back_bytes and has_back_angle:
        try:
            garment_back_data = await analyze_garment(
                garment_back_bytes,
                garment_back_image.content_type,
                hint_category=garment_subcategory or garment_category,
                hint_description=garment_description
            )
        except Exception as e:
            print(f"Back garment analysis failed, falling back to front: {e}")
            garment_back_data = garment_data

    # Step 2 & 3: Loop over selected camera angles, generate custom prompt, and call generate_tryon_image
    persona = {
        "age_group": age_group,
        "ethnicity": ethnicity,
        "body_type": body_type,
        "gender": gender,
        "backdrop": backdrop_scene,
    }
    
    images = []
    last_positive_prompt = ""
    
    try:
        for angle in angles_list:
            is_back = "back" in angle.lower()
            current_garment_data = garment_back_data if (is_back and garment_back_data) else garment_data
            current_garment_bytes = garment_back_bytes if (is_back and garment_back_bytes) else garment_bytes

            # Build custom hyperrealistic prompt tailored to this specific camera angle / pose
            positive_prompt, negative_prompt = build_tryon_prompt(current_garment_data, persona, camera_angle=angle)
            last_positive_prompt = positive_prompt # Save for returning metadata
            
            # Generate the image for this specific view
            img_b64 = await generate_tryon_image(
                positive_prompt=positive_prompt,
                negative_prompt=negative_prompt,
                camera_angle=angle,
                garment_bytes=current_garment_bytes,
                person_bytes=person_bytes,
            )
            images.append(img_b64)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Image generation failed: {e}")

    return {
        "garment_analysis": garment_data,
        "positive_prompt": last_positive_prompt,
        "images": images,
        "model": "Stable Diffusion / FLUX", 
        "fitting_mode": "person_reference" if person_bytes else "garment_reference",
    }


@router.post("/analyze-only")
async def analyze_only(garment_image: UploadFile = File(...)):
    """Run only the Gemini garment analysis step."""
    image_bytes = await garment_image.read()
    garment_data = await analyze_garment(image_bytes, garment_image.content_type)
    return {"garment_analysis": garment_data}


@router.post("/remove-background")
async def remove_background(image: UploadFile = File(...)):
    """Removes background from garment image using local rembg library (U2Net)."""
    import base64
    from rembg import remove
    from PIL import Image
    import io
    
    if image.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPG/PNG/WEBP images accepted.")
        
    image_bytes = await image.read()
    
    try:
        # Run local U2Net background removal
        input_image = Image.open(io.BytesIO(image_bytes))
        output_image = remove(input_image)
        
        # Save output transparent PNG to bytes
        buf = io.BytesIO()
        output_image.save(buf, format="PNG")
        b64_png = base64.b64encode(buf.getvalue()).decode("utf-8")
        return {"image": f"data:image/png;base64,{b64_png}", "fallback": False}
    except Exception as e:
        print(f"Local U2Net background removal failed: {e}. Running local PIL fallback...")
        try:
            from PIL import Image
            import io
            
            img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
            datas = img.getdata()
            
            newData = []
            # Check for light/white backgrounds and make them transparent
            for item in datas:
                if item[0] > 215 and item[1] > 215 and item[2] > 215:
                    newData.append((255, 255, 255, 0))
                else:
                    newData.append(item)
            
            img.putdata(newData)
            buf = io.BytesIO()
            img.save(buf, format="PNG")
            b64_png = base64.b64encode(buf.getvalue()).decode("utf-8")
            return {"image": f"data:image/png;base64,{b64_png}", "fallback": True}
        except Exception as fallback_err:
            print(f"Local PIL fallback failed: {fallback_err}")
            raise HTTPException(status_code=502, detail=f"Background removal failed: {fallback_err}")


class ChatTurn(BaseModel):
    role: str # "user" or "model"
    text: str

class StylistChatRequest(BaseModel):
    user_id: Optional[int] = None
    message: str
    chat_history: list[ChatTurn] = []

@router.post("/stylist-chat")
async def stylist_chat(payload: StylistChatRequest, db: Session = Depends(get_db)):
    # 1. Fetch user sizing profile
    user_height = "Not Specified"
    user_weight = "Not Specified"
    user_body = "Average"
    user_name = "Guest"
    
    if payload.user_id:
        user = db.query(models.User).filter(models.User.id == payload.user_id).first()
        if user:
            user_name = user.name or "Customer"
            user_height = f"{user.height} cm" if user.height else "Not Specified"
            user_weight = f"{user.weight} kg" if user.weight else "Not Specified"
            user_body = user.body_type or "Average"

    # 2. Fetch catalog products
    active_products = db.query(models.Product).all()
    products_text = ""
    for p in active_products:
        products_text += f"- [{p.name} by {p.brand}] (Product ID: {p.id}) Price: ${p.price}. Category: {p.category}. Description: {p.description}\n"

    # 3. Build GenAI system context
    system_instruction = f"""
You are the Aavriti AI Personal Fashion Stylist, a premium fashion advisor helping {user_name} find outfits.
Customer Dimensions & Body Profile:
- Height: {user_height}
- Weight: {user_weight}
- Body Type: {user_body}

Here is our active boutique catalog:
{products_text}

Rules:
1. Recommend actual clothes from our boutique catalog. To link a product, format it exactly like this: [Product Name](/product/<product_id>). This is crucial so the UI renders clickable links.
2. Give personalized fashion styling advice based on their height/weight.
3. Be warm, premium, and professional. Use clean formatting with list bullets and bold text. Keep response concise but informative.
"""

    # 4. Compile prompt history
    prompt_parts = []
    for turn in payload.chat_history:
        role = "Customer" if turn.role == "user" else "Stylist"
        prompt_parts.append(f"{role}: {turn.text}")

    prompt_parts.append(f"Customer: {payload.message}")
    prompt_parts.append("Stylist:")
    
    full_prompt = system_instruction + "\n\nConversation:\n" + "\n".join(prompt_parts)

    from services.gemini_service import client
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=full_prompt
        )
        return {"response": response.text}
    except Exception as e:
        print(f"WARNING: AI Chatbot failed: {e}. Returning fallback response.")
        return {
            "response": "Hello! I am the Aavriti Stylist. I'm currently running in offline preview mode due to API quota limitations. However, I highly recommend trying on our premium sarees or kurtas from the catalog above! Let me know if you would like me to assist you with style pairings."
        }