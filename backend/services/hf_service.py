"""
HuggingFace Inference Service
"""

import io
import base64
import asyncio
import time
from PIL import Image
from huggingface_hub import InferenceClient
from config import settings

# Using FLUX.1-schnell as requested
TRYON_MODEL = "black-forest-labs/FLUX.1-schnell"

# Added a generous 60s timeout
client = InferenceClient(token=settings.HF_TOKEN, timeout=60)


def _pil_to_b64(img: Image.Image) -> str:
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")


def _sync_generate(prompt, negative, w, h, steps, guidance):
    """
    Synchronous wrapper with an AUTOMATIC RETRY LOOP.
    If the free server is asleep/busy, it will try up to 3 times automatically.
    """
    max_retries = 3
    for attempt in range(max_retries):
        try:
            print(f"--> [HuggingFace] Attempt {attempt + 1}/{max_retries}...")
            return client.text_to_image(
                prompt=prompt,
                negative_prompt=negative,
                model=TRYON_MODEL,
                width=w,
                height=h,
                num_inference_steps=steps,
                guidance_scale=guidance,
            )
        except Exception as e:
            print(f"--> [HuggingFace] Attempt {attempt + 1} failed. Server busy or cold.")
            if attempt == max_retries - 1:
                # If we fail 3 times, finally give up and tell the frontend
                raise RuntimeError("HuggingFace servers are heavily congested right now. Please try again in a few minutes.")
            
            # Wait 10 seconds for the model to wake up before trying again
            print("--> Waiting 10 seconds before retrying...")
            time.sleep(10)


async def generate_tryon_image(
    positive_prompt: str,
    negative_prompt: str,
    camera_angle: str = "Front View",
    garment_bytes: bytes | None = None,
    person_bytes: bytes | None = None,
    width: int = 768,             # 🚨 INCREASED for FLUX quality
    height: int = 1024,           # 🚨 INCREASED for FLUX quality
    num_inference_steps: int = 25,
    guidance_scale: float = 9.0,   # Pushed high to force garment consistency
) -> str:
    """Generate a photorealistic try-on image."""
    
    # 1. Construct a clean natural-language prompt without bracket weightings (fully optimized for T5-XXL text encoder)
    final_prompt = f"{positive_prompt} Photographed from the {camera_angle}, showcasing a realistic {camera_angle} camera angle. Perfect fit, high-fashion styling."
    
    # 2. Keep negative parameters as fallback for API compliance
    strict_negative = f"{negative_prompt}, wrong angle, incorrect garment, mutating clothes, altered design, wrong color, changed pattern"

    image = await asyncio.to_thread(
        _sync_generate,
        final_prompt,
        strict_negative,
        width,
        height,
        num_inference_steps,
        guidance_scale
    )

    return _pil_to_b64(image)


async def generate_tryon_variants(
    positive_prompt: str,
    negative_prompt: str,
    camera_angles: str = "Front View", # 🚨 Now accepts the comma-separated string from UI
    garment_bytes: bytes | None = None,
    person_bytes: bytes | None = None,
) -> list[str]:
    """Generate specific views based on user multi-selection."""
    
    # Split the comma-separated string into a clean list: ["Front View", "Back View"]
    angles_list = [a.strip() for a in camera_angles.split(",") if a.strip()]

    results = []
    # Loop precisely through the selected angles
    for angle in angles_list:
        print(f"Generating view: {angle}...")
        
        img_b64 = await generate_tryon_image(
            positive_prompt=positive_prompt,
            negative_prompt=negative_prompt,
            camera_angle=angle,
            garment_bytes=garment_bytes,
            person_bytes=person_bytes,
        )
        results.append(img_b64)

    return results


async def generate_tryon_vton(
    avatar_bytes: bytes,
    garment_bytes: bytes,
    garment_description: str,
    extra_prompt: str = None,
    denoise_steps: int = 30,
) -> str:
    """
    Calls yisol/IDM-VTON Gradio API via gradio_client to perform real virtual try-on.
    """
    import tempfile
    import os
    import shutil
    import base64
    import asyncio
    from gradio_client import Client, handle_file
    
    # Photorealism Prompts
    PHOTOREALISM_POSITIVE_PROMPT = (
        "photorealistic, professional fashion photography, studio lighting, "
        "sharp focus, high resolution, real skin texture, natural pose, "
        "e-commerce product photo, white studio background"
    )

    # Combine description and prompts
    full_des = garment_description or "clothing item"
    if extra_prompt:
        full_des = f"{full_des}. {extra_prompt}"
    full_des = f"{full_des}. {PHOTOREALISM_POSITIVE_PROMPT}"

    # Write bytes to temporary files for gradio_client
    temp_dir = tempfile.mkdtemp()
    avatar_path = os.path.join(temp_dir, "avatar.png")
    garment_path = os.path.join(temp_dir, "garment.png")
    
    try:
        with open(avatar_path, "wb") as f:
            f.write(avatar_bytes)
        with open(garment_path, "wb") as f:
            f.write(garment_bytes)
            
        def _run_vton():
            # Connect to yisol/IDM-VTON Space on HF using the authenticated token
            client = Client("yisol/IDM-VTON", hf_token=settings.HF_TOKEN)
            result = client.predict(
                dict={
                    "background": handle_file(avatar_path),
                    "layers": [],
                    "composite": None
                },
                garm_img=handle_file(garment_path),
                garment_des=full_des,
                is_checked=True,
                is_checked_crop=False,
                denoise_steps=denoise_steps,
                seed=42,
                api_name="/tryon"
            )
            return result
            
        # Run synchronous predict call in an executor thread
        result = await asyncio.to_thread(_run_vton)
        output_image_path = result[0] # output is the first element in returned tuple
        
        # Read resulting image
        with open(output_image_path, "rb") as f:
            output_bytes = f.read()
            
        b64_png = base64.b64encode(output_bytes).decode("utf-8")
        return b64_png
    finally:
        # Clean up temporary directory
        shutil.rmtree(temp_dir, ignore_errors=True)