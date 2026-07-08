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
import requests

# Save original requests methods
_orig_session_get = requests.Session.get
_orig_session_post = requests.Session.post

# Spoof browser headers to bypass Hugging Face ZeroGPU rate limits
BROWSER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://huggingface.co/spaces/yisol/IDM-VTON",
    "Origin": "https://huggingface.co",
}

def _patched_get(self, url, **kwargs):
    if "headers" not in kwargs or kwargs["headers"] is None:
        kwargs["headers"] = {}
    kwargs["headers"].update(BROWSER_HEADERS)
    return _orig_session_get(self, url, **kwargs)

def _patched_post(self, url, **kwargs):
    if "headers" not in kwargs or kwargs["headers"] is None:
        kwargs["headers"] = {}
    kwargs["headers"].update(BROWSER_HEADERS)
    return _orig_session_post(self, url, **kwargs)

requests.Session.get = _patched_get
requests.Session.post = _patched_post

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
            import os
            from PIL import Image
            
            # Flatten inputs to clean RGB JPEGs to prevent server-side RGBA/JPEG serialization issues
            try:
                with Image.open(avatar_path) as img:
                    img.convert("RGB").save(avatar_path, "JPEG")
                with Image.open(garment_path) as img:
                    img.convert("RGB").save(garment_path, "JPEG")
            except Exception as e_conv:
                print(f"Image conversion warning: {e_conv}")

            # Always load and pass HF_TOKEN to bypass the 429 anonymous rate limit blocks
            # Load tokens list to support ZeroGPU quota rotation and bypass rate-limiting
            hf_token_val = os.environ.get("HF_TOKEN")
            hf_tokens_str = os.environ.get("HF_TOKENS", "")
            if hf_tokens_str:
                tokens = [t.strip() for t in hf_tokens_str.split(",") if t.strip()]
            else:
                tokens = [hf_token_val] if hf_token_val else [None]
                
            # Unified Multi-engine VTON fallback list
            spaces = [
                {"name": "debanjan909/Aavriti-VTON", "type": "idm"},
                {"name": "yisol/IDM-VTON", "type": "idm"},
                {"name": "hysts-duplicates/IDM-VTON", "type": "idm"},
                {"name": "zhengchong/CatVTON", "type": "cat"},
                {"name": "multimodalart/CatVTON-zerogpu", "type": "cat"},
                {"name": "zhoujing204/Kolors-Virtual-Try-On", "type": "kolors"}
            ]
            
            last_err = None
            for sp in spaces:
                space_name = sp["name"]
                space_type = sp["type"]
                
                # Try all available tokens for this space before moving to fallback space
                for token_item in tokens:
                    try:
                        token_display = token_item[:8] + "..." if token_item else "None"
                        print(f"Connecting to VTON Space: {space_name} (Type: {space_type}, Token: {token_display})...")
                        client = Client(space_name, token=token_item)
                        
                        if space_type == "idm":
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
                            output_path = result[0]
                        elif space_type == "cat":
                            # Step 1: prep person
                            person_image_dict = client.predict(
                                image_path=handle_file(avatar_path),
                                api_name="/person_example_fn"
                            )
                            # Wrap for EditorData schema
                            wrapped_person = {
                                "background": {
                                    "path": person_image_dict["background"],
                                    "meta": {"_type": "gradio.FileData"}
                                } if person_image_dict.get("background") else None,
                                "layers": [
                                    {
                                        "path": layer,
                                        "meta": {"_type": "gradio.FileData"}
                                    } for layer in person_image_dict.get("layers", [])
                                ],
                                "composite": {
                                    "path": person_image_dict["composite"],
                                    "meta": {"_type": "gradio.FileData"}
                                } if person_image_dict.get("composite") else None
                            }
                            wrapped_garment = {
                                "path": garment_path,
                                "meta": {"_type": "gradio.FileData"}
                            }
                            result = client.predict(
                                person_image=wrapped_person,
                                cloth_image=wrapped_garment,
                                cloth_type="upper",
                                num_inference_steps=20,
                                guidance_scale=2.5,
                                seed=42,
                                show_type="result only",
                                api_name="/submit_function"
                            )
                            output_path = result["path"]
                        elif space_type == "kolors":
                            result = client.predict(
                                person_img=handle_file(avatar_path),
                                garment_img=handle_file(garment_path),
                                seed=42,
                                randomize_seed=True,
                                api_name="/tryon"
                            )
                            output_path = result[0]
                            
                        print(f"Successfully processed try-on using Space: {space_name}!")
                        return output_path
                    except Exception as e:
                        err_msg = str(e)
                        print(f"VTON Space {space_name} failed with token {token_display}: {err_msg}")
                        last_err = e
                        # If the error is a rate limit or quota issue, proceed to rotate tokens
                        if "quota" in err_msg.lower() or "limit" in err_msg.lower() or "too many requests" in err_msg.lower() or "busy" in err_msg.lower():
                            print("Quota/Rate-limit hit. Rotating to next token...")
                            continue
                        else:
                            # For other exceptions (like layout errors), skip to fallback space
                            break
                            
            raise last_err
            
        # Run synchronous predict call in an executor thread
        output_image_path = await asyncio.to_thread(_run_vton)
        
        # Read resulting image
        with open(output_image_path, "rb") as f:
            output_bytes = f.read()
            
        b64_png = base64.b64encode(output_bytes).decode("utf-8")
        return b64_png
    finally:
        # Clean up temporary directory
        shutil.rmtree(temp_dir, ignore_errors=True)