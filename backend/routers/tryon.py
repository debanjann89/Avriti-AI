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

from services.gemini_service import analyze_garment, build_tryon_prompt, detect_photo_angle
from services.hf_service import generate_tryon_image, generate_tryon_variants, generate_tryon_vton

MODEL_ANGLE_MAP = {
    "women": {
        "front_straight":  "static/models/women_front_straight.jpg",
        "front_3quarter":  "static/models/women_front_3quarter.jpg",
        "full_length":     "static/models/women_full_length.jpg",
        "back_view":       "static/models/women_back.jpg",
    },
    "men": {
        "front_straight":  "static/models/men_front_straight.jpg",
        "front_3quarter":  "static/models/men_front_3quarter.jpg",
        "full_length":     "static/models/men_full_length.jpg",
        "back_view":       "static/models/men_back.jpg",
    }
}

DRAPED_GARMENTS   = ["saree", "dupatta", "pallu"]
LAYERED_GARMENTS  = ["lehenga", "salwar", "sharara", "anarkali", "churidar", "kameez", "kurta set"]

def get_tryon_strategy(garment_type: str) -> str:
    gt = (garment_type or "").lower()
    if any(dg in gt for dg in DRAPED_GARMENTS):
        return "drape"
    elif any(lg in gt for lg in LAYERED_GARMENTS):
        return "layered"
    else:
        return "standard"

router = APIRouter()

ALLOWED_TYPES = ("image/jpeg", "image/png", "image/webp")


def remove_bg_and_normalize_safe(image_bytes: bytes) -> bytes:
    """
    Removes the background using rembg and resizes/centers the garment to 768x1024.
    If rembg fails, falls back to a simple PIL resize/pad.
    """
    from PIL import Image
    import io
    
    try:
        from rembg import remove
        img = Image.open(io.BytesIO(image_bytes))
        # Remove background using rembg
        transparent = remove(img)
    except Exception as e:
        print(f"rembg background removal failed: {e}. Falling back to standard transparent crop.")
        # Fallback to standard color keying if rembg fails
        try:
            img = Image.open(io.BytesIO(image_bytes))
            transparent = img.convert("RGBA")
            # Simple color-keying (make very bright/white pixels transparent as fallback)
            data = transparent.getdata()
            new_data = []
            for item in data:
                # If pixel is close to white (common photo background)
                if item[0] > 230 and item[1] > 230 and item[2] > 230:
                    new_data.append((255, 255, 255, 0))
                else:
                    new_data.append(item)
            transparent.putdata(new_data)
        except Exception as e_inner:
            print(f"Fallback keying failed: {e_inner}")
            return image_bytes

    try:
        # Get bounding box of non-transparent areas to crop out background padding
        bbox = transparent.getbbox()
        if bbox:
            cropped = transparent.crop(bbox)
        else:
            cropped = transparent
            
        # Create a transparent 768x1024 canvas
        canvas = Image.new("RGBA", (768, 1024), (0, 0, 0, 0))
        
        # Resize cropped garment preserving aspect ratio to fit inside 768x1024
        cw, ch = cropped.size
        max_w = int(768 * 0.75) # 75% width
        max_h = int(1024 * 0.75) # 75% height
        
        scale = min(max_w / cw, max_h / ch)
        new_w = int(cw * scale)
        new_h = int(ch * scale)
        
        resized_garment = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Paste resized garment in the center of the 768x1024 canvas
        offset_x = (768 - new_w) // 2
        offset_y = (1024 - new_h) // 2
        canvas.paste(resized_garment, (offset_x, offset_y), resized_garment)
        
        # Save canvas to bytes
        buf = io.BytesIO()
        canvas.save(buf, format="PNG")
        return buf.getvalue()
    except Exception as e:
        print(f"Garment normalization failed: {e}")
        return image_bytes

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

    # Step 1: Detect photo angle using Gemini Vision
    try:
        angle_info = await detect_photo_angle(garment_bytes, garment_image.content_type)
        print(f"Detected photo angle and pose recommendations: {angle_info}")
    except Exception as e:
        print(f"Angle detection failed: {e}")
        angle_info = {
            "photo_angle": "flat_lay",
            "garment_visible_side": "front",
            "recommended_model_pose": "front_straight",
            "reason": "Fallback angle detection"
        }

    # Step 2: Analyze front garment with Gemini Vision and category/subcategory/description hints
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

    # Step 3 & 4: Loop over selected camera angles, generate custom prompt, and call VTON strategy
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

            # VTON pipeline
            vton_success = False
            try:
                # 1. Remove background and normalize the garment
                normalized_garment_bytes = remove_bg_and_normalize_safe(current_garment_bytes)
                
                # 2. Prepare avatar bytes
                if person_bytes:
                    avatar_bytes = person_bytes
                else:
                    # Select from curated base model photos
                    angle_lower = angle.lower()
                    if "back" in angle_lower:
                        pose_name = "back_view"
                    elif "three" in angle_lower or "3/4" in angle_lower:
                        pose_name = "front_3quarter"
                    elif "wide" in angle_lower or "full" in angle_lower:
                        pose_name = "full_length"
                    else:
                        pose_name = angle_info.get("recommended_model_pose", "front_straight")

                    gender_val = current_garment_data.get("gender", gender or "women").lower()
                    gender_key = "men" if gender_val in ("men", "man", "male") else "women"
                    model_path = MODEL_ANGLE_MAP.get(gender_key, MODEL_ANGLE_MAP["women"]).get(pose_name, MODEL_ANGLE_MAP[gender_key]["front_straight"])
                    
                    print(f"Loading local base model photo: {model_path}")
                    import os
                    if os.path.exists(model_path):
                         with open(model_path, "rb") as f:
                             avatar_bytes = f.read()
                    else:
                         print(f"Warning: {model_path} not found! Empty avatar bytes.")
                         avatar_bytes = b""
                
                # 3. Call IDM-VTON based on strategy
                g_desc = current_garment_data.get("description", garment_description or "clothing item")
                g_type = current_garment_data.get("garment_type", garment_category or "")
                strategy = get_tryon_strategy(g_type)
                
                # Direct VTON warping for all garments to preserve exact garment texture/look
                print(f"Calling IDM-VTON direct for garment warp: {g_desc}...")
                vton_img_b64 = await generate_tryon_vton(
                    avatar_bytes=avatar_bytes,
                    garment_bytes=normalized_garment_bytes,
                    garment_description=g_desc
                )
                images.append(vton_img_b64)
                vton_success = True
                
                print("VTON try-on generation successful!")
                
            except Exception as e:
                print(f"VTON pipeline failed or timed out: {e}. Falling back to FLUX generation.")
                
            if not vton_success:
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