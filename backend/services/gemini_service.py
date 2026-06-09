"""
Gemini Vision Service — garment analysis + hyperrealistic prompt engineering.
"""

import json
from google import genai
from google.genai import types
from config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

ANALYSIS_PROMPT = """
Analyze this garment image and return ONLY a valid JSON object (no markdown, no explanation) with these fields:

{
  "garment_type": "specific item e.g. anarkali kurta, shirt, blazer, saree, wrap dress",
  "primary_color": "precise color e.g. deep burgundy, ivory, cobalt blue",
  "secondary_color": "e.g. gold, ecru, charcoal (or null if none)",
  "pattern": "e.g. solid, floral, paisley, geometric, block print, embroidered, striped",
  "fabric_texture": "e.g. silk charmeuse, cotton poplin, chiffon, raw silk, jersey (infer from sheen/drape)",
  "neckline": "e.g. V-neck, boat neck, round neck, sweetheart, mandarin collar",
  "sleeve_type": "e.g. sleeveless, cap sleeve, three-quarter, full sleeve, bell sleeve",
  "silhouette": "e.g. A-line, fitted, flowy, straight, empire waist, bodycon",
  "hem_length": "e.g. mini, knee length, midi, maxi, ankle length",
  "style": "e.g. casual, ethnic, formal, fusion, bohemian, streetwear, couture",
  "occasion": "e.g. festive, office, wedding, daily wear, cocktail, beach",
  "key_details": "precise styling details e.g. 'intricate zari embroidery on hem, side slit, self-fabric belt'"
}

Be extremely specific. The output drives a photorealistic fashion image generator.
"""
def detect_dominant_color(image_bytes: bytes) -> str:
    from PIL import Image
    import io
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        width, height = img.size
        # Crop center 40% where the garment is most likely to be
        left = int(width * 0.3)
        top = int(height * 0.3)
        right = int(width * 0.7)
        bottom = int(height * 0.7)
        cropped = img.crop((left, top, right, bottom))
        
        # Resize to 1x1 to get average color
        cropped = cropped.resize((1, 1))
        r, g, b = cropped.getpixel((0, 0))
        
        # Basic colors mapping
        colors = {
            "white": (245, 245, 245),
            "black": (20, 20, 20),
            "grey": (128, 128, 128),
            "red": (220, 30, 30),
            "blue": (30, 80, 220),
            "green": (30, 180, 30),
            "yellow": (240, 220, 20),
            "orange": (240, 120, 20),
            "purple": (120, 30, 180),
            "pink": (240, 100, 180),
            "brown": (120, 60, 20),
            "maroon": (100, 10, 30),
            "navy": (15, 30, 100),
            "beige": (225, 210, 180),
            "cream": (250, 245, 220),
        }
        
        closest_color = "blue"
        min_dist = float("inf")
        for name, rgb in colors.items():
            dist = (r - rgb[0])**2 + (g - rgb[1])**2 + (b - rgb[2])**2
            if dist < min_dist:
                min_dist = dist
                closest_color = name
        return closest_color
    except Exception as e:
        print(f"Error detecting dominant color: {e}")
        return "blue"


async def analyze_garment(
    image_bytes: bytes, 
    mime_type: str = "image/jpeg",
    hint_category: str = None,
    hint_description: str = None
) -> dict:
    """Send garment image to Gemini Vision and return structured metadata."""
    instructions = ANALYSIS_PROMPT
    if hint_category or hint_description:
        guide = "\n\nGuiding Hints for Verification:"
        if hint_category:
            guide += f"\n- The user specified this item is a: {hint_category}"
        if hint_description:
            guide += f"\n- Item style description/reference details: {hint_description}"
        guide += "\nUse these details to double-check and refine your analysis, ensuring color, pattern, texture, silhouette, and sleeve details are extremely realistic and align with this specification."
        instructions = instructions + guide

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                instructions
            ]
        )

        raw = response.text.strip()
        # Strip accidental markdown fences
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        return json.loads(raw.strip())

    except Exception as e:
        print(f"WARNING: Gemini garment analysis failed: {e}. Using fallback mock analysis.")
        
        # Detect dominant color from image bytes
        primary_color = detect_dominant_color(image_bytes)
        
        # Determine fallback values based on category/hints
        category = hint_category if hint_category else "garment"
        description = hint_description if hint_description else "premium styling"
        
        # Infer garment type from category / description / preset
        garment_type = "t-shirt"
        desc_lower = description.lower()
        cat_lower = category.lower()
        if "shirt" in desc_lower or "shirt" in cat_lower:
            if "t-shirt" in desc_lower or "t-shirt" in cat_lower or "casual" in desc_lower:
                garment_type = "t-shirt"
            else:
                garment_type = "shirt"
        elif "polo" in desc_lower:
            garment_type = "polo shirt"
        elif "jacket" in desc_lower or "jacket" in cat_lower:
            garment_type = "jacket"
        elif "blazer" in desc_lower or "blazer" in cat_lower:
            garment_type = "blazer"
        elif "saree" in desc_lower or "saree" in cat_lower or "sari" in desc_lower:
            garment_type = "saree"
        elif "lehenga" in desc_lower or "lehenga" in cat_lower:
            garment_type = "lehenga"
        elif "kurta" in desc_lower or "kurta" in cat_lower or "suits" in cat_lower:
            garment_type = "kurta"
        elif "jeans" in desc_lower or "denim" in desc_lower:
            garment_type = "denim jeans"
            
        # Infer sleeve and neckline
        neckline = "round neck"
        if "v-neck" in desc_lower:
            neckline = "V-neck"
        elif "collar" in desc_lower or "polo" in desc_lower:
            neckline = "collared neck"
            
        sleeve_type = "short sleeves"
        if "long sleeve" in desc_lower or "full sleeve" in desc_lower:
            sleeve_type = "full sleeve"
        elif "sleeveless" in desc_lower:
            sleeve_type = "sleeveless"

        return {
            "garment_type": garment_type,
            "primary_color": primary_color,
            "secondary_color": None,
            "pattern": "graphic print" if (desc_lower and "graphic" in desc_lower or "print" in desc_lower) else "solid",
            "fabric_texture": "premium quality cotton fabric",
            "neckline": neckline,
            "sleeve_type": sleeve_type,
            "silhouette": "relaxed fit",
            "hem_length": "standard length",
            "style": "casual" if (garment_type in ["t-shirt", "shirt", "polo shirt", "jacket"]) else "ethnic",
            "occasion": "daily wear",
            "key_details": description
        }


def build_tryon_prompt(garment: dict, persona: dict, camera_angle: str = "Front View") -> tuple[str, str]:
    """
    Build a hyperrealistic FLUX.1 prompt from Gemini garment data + persona, tailored to camera angles.
    """
    age_map = {
        "Teen": "19-year-old",
        "Young Adult": "26-year-old",
        "Adult": "35-year-old",
        "Senior": "52-year-old",
    }
    age = age_map.get(persona.get("age_group", "Young Adult"), "26-year-old")
    ethnicity = persona.get("ethnicity", "South Asian")
    
    body_map = {
        "xs": "petite and slender",
        "s": "slender",
        "m": "average height and build",
        "l": "athletic and well-built",
        "xl": "plus size, full-figured",
        "xxl": "plus size, curvier build",
        "slim": "slender",
        "athletic": "athletic",
        "average": "average height and build",
        "plus size": "plus size, full-figured"
    }
    raw_body = persona.get("body_type", "M").lower().strip()
    body = body_map.get(raw_body, raw_body)
    gender = persona.get("gender", "Woman").lower()

    g = garment
    secondary = f" with {g['secondary_color']} accents" if g.get("secondary_color") else ""
    neckline = f", {g['neckline']}" if g.get("neckline") else ""
    sleeve = f", {g['sleeve_type']} sleeves" if g.get("sleeve_type") else ""
    silhouette = f", {g['silhouette']} silhouette" if g.get("silhouette") else ""
    hem = f", {g['hem_length']} length" if g.get("hem_length") else ""

    # Check if this is a men's upperwear item (shirt, t-shirt, polo, etc.)
    is_men = gender == "man"
    garment_type_lower = g.get("garment_type", "").lower()
    is_upperwear = any(kw in garment_type_lower for kw in ["shirt", "t-shirt", "polo", "jacket", "blazer", "hoodie", "sweater", "top"])

    # Base Model Descriptors
    if is_men:
        model_descriptor = f"handsome male fashion model, chiseled jawline, {age} {ethnicity}, {body} build"
    else:
        model_descriptor = f"beautiful female fashion model, graceful posture, {age} {ethnicity}, {body} build"

    # Backdrop / Scene Selector logic
    backdrop = persona.get("backdrop", "Minimalist Studio").lower().strip()
    if "palace" in backdrop or "royal" in backdrop:
        scene_desc = "Grand traditional Indian heritage royal palace stone courtyard backdrop, warm natural sunlight, ancient arches and columns in soft focus, realistic shadows. "
    elif "festive" in backdrop or "lights" in backdrop:
        scene_desc = "Intimate luxury festive evening background with warm golden hour string lights, glowing traditional oil lamps, elegant soft warm glowing bokeh, professional studio lighting. "
    elif "garden" in backdrop or "outdoor" in backdrop:
        scene_desc = "Lush green royal heritage garden backdrop, soft warm afternoon sunlight streaming through leaves, beautiful green leafy bokeh background, soft natural fill light. "
    else:
        # Default Neutral Grey Studio
        scene_desc = "Solid professional neutral studio grey background, soft three-point fashion studio lighting, diffused key light, soft fill, subtle rim highlight. "

    pose_desc = ""
    outfit_desc = "Wearing clean dark blue denim jeans and white fashion sneakers. "
    shot_type = "professional fashion photography, RAW photo, Canon EOS R5, 85mm f/1.4 lens, ISO 100, ultra sharp focus, natural skin texture, photorealistic fabric rendering, 8K UHD"

    # Custom Poses for Men's Upperwear based on Camera Angles
    if is_men and is_upperwear:
        angle_clean = camera_angle.lower().strip()
        if "front" in angle_clean:
            # Pose 3: Standing Front Shot
            pose_desc = "Standing confidently straight, facing front, one hand casually adjusting the shirt collar, looking forward, calm natural expression. "
            outfit_desc = "Paired with dark blue denim jeans, confident model posture. "
            shot_type = "Front-facing medium-full shot, RAW photo, professional studio photography, ultra sharp focus"
        elif "three" in angle_clean or "3/4" in angle_clean:
            # Pose 3/4
            pose_desc = "Standing in a stylish three-quarter view, looking slightly past the camera, one hand resting on the hip, relaxed and confident fashion pose. "
            outfit_desc = "Paired with dark blue denim jeans, elegant body turn. "
            shot_type = "Three-quarter fashion shot, RAW photo, professional fashion photography, ultra sharp focus"
        elif "side" in angle_clean or "profile" in angle_clean:
            # Pose 2: Sitting on wooden high stool with sunglasses
            pose_desc = "Sitting relaxed and leaning slightly on a tall wooden fashion studio stool, photographed from a stylish side angle, wearing dark modern sunglasses, looking slightly to the side with a cool confident posture. "
            outfit_desc = "Paired with dark blue denim jeans and a classic black wristwatch, seated model posture. "
            shot_type = "Medium shot, photographed from a 45-degree angle, RAW photo, professional fashion photography, soft shadows"
        elif "wide" in angle_clean or "shot" in angle_clean:
            # Pose 4: Full Body on wooden stool
            pose_desc = "Full-body shot sitting comfortably on a high wooden studio stool, looking forward with a natural expression, hands resting on knees. "
            outfit_desc = "Complete stylish outfit: wearing the upperwear paired with dark blue denim jeans, white fashion sneakers, and a black watch. "
            shot_type = "Full body studio fashion shot, RAW photo, wide lens, ultra sharp focus"
        elif "back" in angle_clean:
            # Back View
            pose_desc = "Back-facing view showing the fit, texture, and stitching details of the shirt back, clean standing posture, head turned slightly over the shoulder. "
            outfit_desc = "Paired with dark blue denim jeans. "
            shot_type = "Back shot, professional studio photography, sharp fabric details"
        elif "close" in angle_clean or "detail" in angle_clean:
            # Close-Up / Detail shot (Pose 1 style)
            pose_desc = "Close-up detail shot focusing on the high-quality fabric weave, stitching, button placket, and collar lines. "
            outfit_desc = ""
            shot_type = "Macro studio photography, extreme close-up, shallow depth of field, fabric texture focus"
        elif "low" in angle_clean or "hero" in angle_clean:
            # Low Angle Hero Shot
            pose_desc = "Standing tall with a powerful and confident posture, looking slightly down towards the camera lens, chest out, heroic pose. "
            outfit_desc = "Paired with dark blue denim jeans and a premium watch. "
            shot_type = "Low angle hero shot, dynamic perspective, professional fashion photography, powerful shadows"
        elif "walk" in angle_clean or "dynamic" in angle_clean:
            # Dynamic Walking Shot
            pose_desc = "Captured in mid-stride walking forward, dynamic body motion, clothing fabric moving naturally with the stride, relaxed natural facial expression. "
            outfit_desc = "Paired with dark blue denim jeans and white sneakers, walking model posture. "
            shot_type = "Action fashion snapshot, dynamic walking shot, mid-stride capture, soft motion blur in background"
        else:
            pose_desc = "Standing confidently in a relaxed fashion pose. "
            outfit_desc = "Paired with dark blue denim jeans. "
            shot_type = "Professional fashion photography, RAW photo"
    else:
        # Standard Pose (for Women or other garments)
        angle_clean = camera_angle.lower().strip()
        if "back" in angle_clean:
            pose_desc = "Back-facing view showing the elegant fit, embroidery, and back detailing of the garment. "
        elif "close" in angle_clean or "detail" in angle_clean:
            pose_desc = "Close-up macro detail shot focusing on the intricate embroidery, pattern, print, and fine stitch details of the garment. "
            shot_type = "Macro fashion photography, extreme close-up, fabric details, shallow depth of field"
        elif "low" in angle_clean or "hero" in angle_clean:
            pose_desc = "Standing tall and elegant with a regal posture, looking slightly down towards the lens, showcasing the long lines of the outfit. "
            shot_type = "Low angle elegant fashion shot, regal dynamic perspective"
        elif "walk" in angle_clean or "dynamic" in angle_clean:
            pose_desc = "Captured in dynamic motion, walking gracefully, fabric of the garment flowing beautifully in mid-air with soft wrinkles and realistic wind flow. "
            shot_type = "Action fashion shot, dynamic movement capture, flowing fabric"
        elif "three" in angle_clean or "3/4" in angle_clean:
            pose_desc = "Standing in a graceful three-quarter body posture, body turned slightly, face looking towards the camera with a warm natural expression. "
            shot_type = "Three-quarter elegant fashion shot, professional studio lighting"
        else:
            pose_desc = "Graceful natural pose, leaning slightly on a tall wooden fashion studio stool, relaxed expression. "
        outfit_desc = "Wearing clean dark blue denim jeans and white fashion sneakers. "

    positive = (
        f"{shot_type}. "
        f"{model_descriptor} in a {pose_desc}{outfit_desc}"
        f"The model is wearing a highly detailed, authentic {g['primary_color']}{secondary} {g['garment_type']}{neckline}{sleeve}{silhouette}{hem}. "
        f"The fabric is premium quality {g.get('fabric_texture', 'textile')} with a visible {g['pattern']} pattern. "
        f"Exquisite garment details include {g['key_details']}. "
        f"This is a {g['style']} style, perfect for {g.get('occasion', 'fashion')} wear. "
        f"{scene_desc}"
        "The garment drapes naturally on the model's body with realistic fabric folds, wrinkles, and authentic lighting shadows. "
        "Extremely detailed skin texture with visible skin pores, sharp eyes, natural skin reflections, lifelike textures, professional editorial fashion photography."
    )

    negative = (
        # AI/digital artifacts
        "cartoon, anime, illustration, CGI, 3D render, painting, sketch, watercolor, "
        "digital art, concept art, artificial, synthetic, plastic skin, waxy, "

        # Body defects
        "deformed, mutated, extra limbs, missing limbs, bad anatomy, bad proportions, "
        "floating hands, disfigured face, cross-eyed, asymmetric face, ugly, "

        # Image quality issues
        "blurry, motion blur, out of focus, low quality, jpeg artifacts, pixelated, "
        "noise, grain, overexposed, underexposed, flat lighting, harsh shadows, "

        # Fashion-specific issues
        "ill-fitting clothes, wrinkled background, cluttered background, props, "
        "wrong garment color, pattern mismatch, clothing that doesn't match description, "
        "cropped body, partial figure, headless, faceless, "

        # Text/watermarks
        "text, watermark, logo, signature, border, frame, "

        # Gender issues
        "wrong gender, gender ambiguity, crossdressing"
    )

    return positive, negative

# Schema for Structured URL Product Extractor
from pydantic import BaseModel
from typing import Optional

class ExtractedProduct(BaseModel):
    name: str
    brand: Optional[str] = None
    price: float
    image: Optional[str] = None
    images: Optional[list[str]] = None
    category: Optional[str] = None
    description: Optional[str] = None
    fabric: Optional[str] = None
    craft_technique: Optional[str] = None
    wash_care: Optional[str] = None
    country_of_origin: Optional[str] = None

def clean_html(html_text: str) -> str:
    import re
    # 1. Remove script and style tags
    html_text = re.sub(r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>', '', html_text, flags=re.IGNORECASE)
    html_text = re.sub(r'<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>', '', html_text, flags=re.IGNORECASE)
    # 2. Remove SVG tags
    html_text = re.sub(r'<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>', '', html_text, flags=re.IGNORECASE)
    # 3. Remove inline class and style parameters
    html_text = re.sub(r'\s+class="[^"]*"', '', html_text)
    html_text = re.sub(r'\s+style="[^"]*"', '', html_text)
    # 4. Remove HTML comments
    html_text = re.sub(r'<!--.*?-->', '', html_text, flags=re.DOTALL)
    # 5. Compress multiple spaces
    html_text = re.sub(r'\s+', ' ', html_text)
    return html_text.strip()

def extract_product_from_html(html_text: str) -> dict:
    """Uses Gemini structured generation to parse e-commerce HTML details."""
    cleaned_html = clean_html(html_text)
    
    prompt = """
    Analyze this e-commerce webpage HTML and extract all available details about the product.
    
    Fields to extract:
    - name: The full descriptive title of the product.
    - brand: The brand name of the product.
    - price: The current numeric price (as float, remove currency symbols like ₹, $, etc. e.g. 2999).
    - image: The primary product image URL. First look in metadata tags (e.g. og:image, twitter:image, image_src), zoom image srcs, or main gallery image containers. Ensure you return a direct valid URL link, not a relative path or placeholder.
    - images: A list of up to 5 alternative product images (e.g. carousel images, detail views, different angles). Search for image list grids or arrays.
    - category: Choose the single best category from: "Sarees", "Lehengas", "Kurtas & Suits", "Western Wear", "Accessories".
    - description: A detailed summary of the product's design, style, prints, and look.
    - fabric: The main fabric type (e.g. Silk, Georgette, Organza, Cotton, Linen, Polyester).
    - craft_technique: The weaving or crafting technique (e.g. Handloom, Banarasi Brocade, Zari Weave, Hand Block Print, None if not applicable).
    - wash_care: The wash care instructions (e.g. Dry Clean Only, Hand Wash Cold, Machine Wash).
    - country_of_origin: The country of origin (e.g. India).
    
    Return ONLY a valid JSON object matching the requested schema. If a field is not found in the HTML, set it to null.
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                f"{prompt}\n\nWebpage HTML:\n\n{cleaned_html[:150000]}"
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ExtractedProduct,
            )
        )
        
        raw = response.text.strip()
        return json.loads(raw)
    except Exception as e:
        print(f"WARNING: Gemini HTML parser failed: {e}. Using fallback parsed schema.")
        return {
            "name": "Imported Product",
            "brand": "Online Boutique",
            "price": 1499.0,
            "image": None,
            "images": [],
            "category": "Kurtas & Suits",
            "description": "Premium outfit details could not be extracted automatically because the AI extraction service quota is exhausted. Please edit details manually.",
            "fabric": "Cotton Blend",
            "craft_technique": "Hand Block Print",
            "wash_care": "Dry Clean Recommended",
            "country_of_origin": "India"
        }
