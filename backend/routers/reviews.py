from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from database import get_db
import models
import datetime

router = APIRouter()

class ReviewCreate(BaseModel):
    user_id: int
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5 stars")
    comment: str
    tryon_image_url: str | None = None

@router.get("/product/{product_id}")
def get_product_reviews(product_id: str, db: Session = Depends(get_db)):
    reviews = db.query(models.ProductReview).filter(models.ProductReview.product_id == product_id).order_by(models.ProductReview.id.desc()).all()
    
    output = []
    for r in reviews:
        output.append({
            "id": r.id,
            "user_id": r.user_id,
            "user_name": r.user.name if r.user else "Anonymous",
            "user_avatar": r.user.profile_picture if r.user else None,
            "rating": r.rating,
            "comment": r.comment,
            "tryon_image_url": r.tryon_image_url,
            "created_at": r.created_at
        })
    return output

@router.post("/product/{product_id}")
def create_product_review(product_id: str, payload: ReviewCreate, db: Session = Depends(get_db)):
    # Verify product exists
    prod = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    # Verify user exists
    user = db.query(models.User).filter(models.User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_review = models.ProductReview(
        user_id=payload.user_id,
        product_id=product_id,
        rating=payload.rating,
        comment=payload.comment,
        tryon_image_url=payload.tryon_image_url,
        created_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    
    return {
        "message": "Review submitted successfully",
        "review": {
            "id": new_review.id,
            "rating": new_review.rating,
            "comment": new_review.comment,
            "tryon_image_url": new_review.tryon_image_url,
            "created_at": new_review.created_at
        }
    }
