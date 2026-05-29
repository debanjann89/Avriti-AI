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
        tryOnCompatible=product.tryOnCompatible
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

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
