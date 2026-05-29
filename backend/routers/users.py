from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models
import os
import uuid

router = APIRouter()

class ProfileUpdate(BaseModel):
    user_id: int
    name: str
    phone: str = None
    shipping_address: str = None
    height: str = None
    weight: str = None
    body_type: str = None
    shoulder_width: str = None
    waist_size: str = None

class RoleUpdate(BaseModel):
    user_id: int
    role: str

@router.put("/profile")
def update_profile(profile: ProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == profile.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.name = profile.name
    user.phone = profile.phone
    user.shipping_address = profile.shipping_address
    user.height = profile.height
    user.weight = profile.weight
    user.body_type = profile.body_type
    user.shoulder_width = profile.shoulder_width
    user.waist_size = profile.waist_size
    
    db.commit()
    db.refresh(user)
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "profile_picture": user.profile_picture,
        "phone": user.phone,
        "shipping_address": user.shipping_address,
        "height": user.height,
        "weight": user.weight,
        "body_type": user.body_type,
        "shoulder_width": user.shoulder_width,
        "waist_size": user.waist_size
    }

@router.put("/role")
def update_role(data: RoleUpdate, db: Session = Depends(get_db)):
    if data.role not in ["buyer", "seller", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
        
    user = db.query(models.User).filter(models.User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.role = data.role
    db.commit()
    db.refresh(user)
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "profile_picture": user.profile_picture,
        "phone": user.phone,
        "shipping_address": user.shipping_address,
        "height": user.height,
        "weight": user.weight,
        "body_type": user.body_type,
        "shoulder_width": user.shoulder_width,
        "waist_size": user.waist_size
    }

@router.post("/profile-picture")
async def upload_profile_picture(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Ensure folder exists
    upload_dir = "static/uploads/avatars"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save file
    file_extension = os.path.splitext(file.filename)[1]
    if not file_extension:
        file_extension = ".png"
        
    filename = f"{uuid.uuid4()}{file_extension}"
    filepath = os.path.join(upload_dir, filename)
    
    try:
        contents = await file.read()
        with open(filepath, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
        
    image_url = f"http://127.0.0.1:8000/static/uploads/avatars/{filename}"
    user.profile_picture = image_url
    db.commit()
    db.refresh(user)
    
    return {
        "profile_picture": image_url
    }

class SellerCreate(BaseModel):
    name: str
    email: str
    password: str

@router.post("/create-seller")
def create_seller(data: SellerCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    import bcrypt
    hashed_password = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_seller = models.User(
        email=data.email, 
        hashed_password=hashed_password, 
        name=data.name,
        role="seller"
    )
    db.add(new_seller)
    db.commit()
    db.refresh(new_seller)
    
    return {
        "id": new_seller.id,
        "email": new_seller.email,
        "name": new_seller.name,
        "role": new_seller.role
    }

@router.get("/sellers")
def get_sellers(db: Session = Depends(get_db)):
    sellers = db.query(models.User).filter(models.User.role == "seller").all()
    return [{"id": s.id, "name": s.name, "email": s.email, "role": s.role} for s in sellers]

