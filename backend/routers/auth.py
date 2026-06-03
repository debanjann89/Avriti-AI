from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models
import bcrypt
import jwt
import datetime
import random
import re
import time

router = APIRouter()
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"

# In-memory store for generated OTPs: email -> { "code": str, "expires_at": float }
otp_store = {}

class OTPRequest(BaseModel):
    email: str

class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    otp: str

class UserLogin(BaseModel):
    email: str
    password: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/send-otp")
def send_otp(payload: OTPRequest):
    email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if not re.match(email_regex, payload.email):
        raise HTTPException(status_code=400, detail="Invalid email address format.")
        
    otp_code = f"{random.randint(100000, 999999)}"
    otp_store[payload.email] = {
        "code": otp_code,
        "expires_at": time.time() + 300  # 5 minutes
    }
    
    print(f"\n====================================\n[EMAIL OTP] Code for {payload.email}: {otp_code}\n====================================\n")
    return {
        "message": "Verification code sent successfully to email.",
        "dev_otp": otp_code
    }

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if not re.match(email_regex, user.email):
        raise HTTPException(status_code=400, detail="Invalid email address format.")
        
    stored_otp = otp_store.get(user.email)
    if not stored_otp:
        raise HTTPException(status_code=400, detail="No verification code was sent to this email.")
        
    if time.time() > stored_otp["expires_at"]:
        otp_store.pop(user.email, None)
        raise HTTPException(status_code=400, detail="Verification code has expired. Please send a new code.")
        
    if stored_otp["code"] != user.otp:
        raise HTTPException(status_code=400, detail="Incorrect verification code. Please check and try again.")
        
    otp_store.pop(user.email, None)

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

