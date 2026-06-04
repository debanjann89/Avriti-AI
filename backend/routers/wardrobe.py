from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models
import datetime
import os
import uuid
import base64

router = APIRouter()

class SaveImageRequest(BaseModel):
    user_id: int
    image_b64: str  # Generative image outputs are base64 strings
    product_id: str | None = None

def save_base64_file(b64_data: str, folder: str = "static/uploads/wardrobe") -> str:
    os.makedirs(folder, exist_ok=True)
    if "," in b64_data:
        b64_data = b64_data.split(",")[1]
    
    img_data = base64.b64decode(b64_data)
    filename = f"wardrobe_{uuid.uuid4().hex}.png"
    filepath = os.path.join(folder, filename)
    with open(filepath, "wb") as f:
        f.write(img_data)
    return f"/static/uploads/wardrobe/{filename}"

@router.post("/save")
def save_wardrobe_image(payload: SaveImageRequest, db: Session = Depends(get_db)):
    # Verify user exists
    user = db.query(models.User).filter(models.User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        url_path = save_base64_file(payload.image_b64)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process image data: {str(e)}")

    new_img = models.TryOnImage(
        user_id=payload.user_id,
        image_url=url_path,
        product_id=payload.product_id,
        created_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.add(new_img)
    db.commit()
    db.refresh(new_img)
    
    return {
        "message": "Image successfully saved to virtual wardrobe gallery",
        "image": {
            "id": new_img.id,
            "image_url": new_img.image_url,
            "product_id": new_img.product_id,
            "created_at": new_img.created_at
        }
    }

@router.get("/gallery")
def get_gallery(user_id: int, db: Session = Depends(get_db)):
    images = db.query(models.TryOnImage).filter(models.TryOnImage.user_id == user_id).order_by(models.TryOnImage.id.desc()).all()
    return [
        {
            "id": img.id,
            "image_url": img.image_url,
            "product_id": img.product_id,
            "created_at": img.created_at
        }
        for img in images
    ]

@router.delete("/{image_id}")
def delete_wardrobe_image(image_id: int, db: Session = Depends(get_db)):
    img = db.query(models.TryOnImage).filter(models.TryOnImage.id == image_id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Wardrobe image not found")

    # Clean file from local storage
    relative_path = img.image_url.lstrip("/")
    if os.path.exists(relative_path):
        try:
            os.remove(relative_path)
        except Exception as e:
            print(f"[WARNING] Failed to remove local wardrobe file {relative_path}: {e}")

    db.delete(img)
    db.commit()
    return {"message": "Image deleted from wardrobe successfully"}
