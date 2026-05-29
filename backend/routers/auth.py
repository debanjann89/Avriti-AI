from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models
import bcrypt
import jwt
import datetime

router = APIRouter()
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = models.User(email=user.email, hashed_password=hashed_password, name=user.name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token({"sub": str(new_user.id)})
    return {
        "token": token,
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
            "role": new_user.role,
            "profile_picture": new_user.profile_picture,
            "phone": new_user.phone,
            "shipping_address": new_user.shipping_address,
            "height": new_user.height,
            "weight": new_user.weight,
            "body_type": new_user.body_type,
            "shoulder_width": new_user.shoulder_width,
            "waist_size": new_user.waist_size
        }
    }

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not bcrypt.checkpw(user.password.encode('utf-8'), db_user.hashed_password.encode('utf-8')):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    token = create_access_token({"sub": str(db_user.id)})
    return {
        "token": token,
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "name": db_user.name,
            "role": db_user.role,
            "profile_picture": db_user.profile_picture,
            "phone": db_user.phone,
            "shipping_address": db_user.shipping_address,
            "height": db_user.height,
            "weight": db_user.weight,
            "body_type": db_user.body_type,
            "shoulder_width": db_user.shoulder_width,
            "waist_size": db_user.waist_size
        }
    }

