from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models
import uuid

router = APIRouter()

class ProductCreate(BaseModel):
    name: str
    brand: str
    price: float
    image: str
    category: str
    description: str
    tryOnCompatible: bool = False
    
    # Extended metadata
    fabric: str | None = None
    craft_technique: str | None = None
    wash_care: str | None = None
    country_of_origin: str | None = None
    external_url: str | None = None

def save_base64_image(image_str: str) -> str:
    if image_str.startswith("data:image"):
        try:
            import base64
            import uuid
            import re
            
            header, encoded = image_str.split(",", 1)
            ext_match = re.search(r"image/(\w+)", header)
            extension = ext_match.group(1) if ext_match else "png"
            if extension == "jpeg":
                extension = "jpg"
                
            filename = f"{uuid.uuid4()}.{extension}"
            filepath = f"static/uploads/{filename}"
            
            file_data = base64.b64decode(encoded)
            with open(filepath, "wb") as f:
                f.write(file_data)
                
            return f"http://127.0.0.1:8000/static/uploads/{filename}"
        except Exception as e:
            print(f"Error saving base64 image: {e}")
    return image_str

@router.get("/")
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@router.post("/")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    saved_image_url = save_base64_image(product.image)
    db_product = models.Product(
        id=str(uuid.uuid4()),
        name=product.name,
        brand=product.brand,
        price=product.price,
        image=saved_image_url,
        category=product.category,
        description=product.description,
        tryOnCompatible=product.tryOnCompatible,
        fabric=product.fabric,
        craft_technique=product.craft_technique,
        wash_care=product.wash_care,
        country_of_origin=product.country_of_origin,
        external_url=product.external_url
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

class URLImportRequest(BaseModel):
    url: str

@router.post("/extract-url")
async def extract_url_details(payload: URLImportRequest):
    import asyncio
    import subprocess
    try:
        # Run curl via subprocess to bypass TLS fingerprint blocks / CAPTCHAs
        cmd = [
            "curl",
            "-H", "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "-H", "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "-H", "Accept-Language: en-US,en;q=0.9",
            "-L",
            "--compressed",
            payload.url
        ]
        
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            error_msg = stderr.decode('utf-8', errors='ignore')
            return {"error": f"Failed to download webpage. Curl failed: {error_msg}"}
            
        html_text = stdout.decode('utf-8', errors='ignore')
        
        # Check if the returned HTML is just a bot block page or CAPTCHA
        if len(html_text) < 25000 and ("captcha" in html_text.lower() or "robot check" in html_text.lower() or "continue shopping" in html_text.lower() or "automated access" in html_text.lower()):
            return {"error": "Amazon or Flipkart blocked the automated crawler request with a CAPTCHA screen. Please enter the product details manually."}
            
        # Call our Gemini HTML extractor service
        from services.gemini_service import extract_product_from_html
        extracted_data = extract_product_from_html(html_text)
        
        # Map default fields in case Gemini misses them
        if not extracted_data.get("name"):
            extracted_data["name"] = "Imported Outfit"
        if not extracted_data.get("price"):
            extracted_data["price"] = 0.0
        
        # Inject URL reference
        extracted_data["external_url"] = payload.url
        return extracted_data
        
    except Exception as e:
        return {"error": f"Scraping/AI extraction failed: {str(e)}"}

@router.put("/{product_id}")
def update_product(product_id: str, product: ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product:
        saved_image_url = save_base64_image(product.image)
        db_product.name = product.name
        db_product.brand = product.brand
        db_product.price = product.price
        db_product.image = saved_image_url
        db_product.category = product.category
        db_product.description = product.description
        db_product.tryOnCompatible = product.tryOnCompatible
        db_product.fabric = product.fabric
        db_product.craft_technique = product.craft_technique
        db_product.wash_care = product.wash_care
        db_product.country_of_origin = product.country_of_origin
        db_product.external_url = product.external_url
        db.commit()
        db.refresh(db_product)
    return db_product

@router.delete("/{product_id}")
def delete_product(product_id: str, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
    return {"status": "success"}
