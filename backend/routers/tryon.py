"""
Virtual Try-On Router
Exposes the end-to-end try-on pipeline as REST endpoints.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Literal, Optional

from services.gemini_service import analyze_garment, build_tryon_prompt
from services.hf_service import generate_tryon_image, generate_tryon_variants

router = APIRouter()

ALLOWED_TYPES = ("image/jpeg", "image/png", "image/webp")


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/generate")
async def generate_tryon(
    garment_image: UploadFile = File(..., description="Garment photo (JPG/PNG/WEBP)"),
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
    1. Gemini analyzes the garment image with category hints
    2. Builds a hyperrealistic prompt
    3. HF generates try-on image(s) for each selected camera angle
    4. Returns base64 images + metadata
    """
    if garment_image.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPG/PNG/WEBP images accepted.")

    garment_bytes = await garment_image.read()

    # Read person image if provided
    person_bytes: bytes | None = None
    if person_image and person_image.content_type in ALLOWED_TYPES:
        person_bytes = await person_image.read()

    # Step 1: Analyze garment with Gemini Vision and category/subcategory/description hints
    try:
        garment_data = await analyze_garment(
            garment_bytes, 
            garment_image.content_type,
            hint_category=garment_subcategory or garment_category,
            hint_description=garment_description
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini analysis failed: {e}")

    # Step 2 & 3: Loop over selected camera angles, generate custom prompt, and call generate_tryon_image
    persona = {
        "age_group": age_group,
        "ethnicity": ethnicity,
        "body_type": body_type,
        "gender": gender,
        "backdrop": backdrop_scene,
    }
    
    angles_list = [a.strip() for a in camera_angles.split(",") if a.strip()]
    images = []
    last_positive_prompt = ""
    
    try:
        for angle in angles_list:
            # Build custom hyperrealistic prompt tailored to this specific camera angle / pose
            positive_prompt, negative_prompt = build_tryon_prompt(garment_data, persona, camera_angle=angle)
            last_positive_prompt = positive_prompt # Save for returning metadata
            
            # Generate the image for this specific view
            img_b64 = await generate_tryon_image(
                positive_prompt=positive_prompt,
                negative_prompt=negative_prompt,
                camera_angle=angle,
                garment_bytes=garment_bytes,
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