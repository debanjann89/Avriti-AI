from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter()

class CartAdd(BaseModel):
    user_id: int
    product_id: str
    size: str | None = "M"

@router.get("/{user_id}")
def get_cart(user_id: int, db: Session = Depends(get_db)):
    items = db.query(models.CartItem).filter(models.CartItem.user_id == user_id).all()
    # Serialize to include product details
    result = []
    for item in items:
        prod = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if prod:
            result.append({
                "id": item.id,
                "quantity": item.quantity,
                "size": item.size or "M",
                "product": {
                    "id": prod.id,
                    "name": prod.name,
                    "brand": prod.brand,
                    "price": prod.price,
                    "image": prod.image
                }
            })
    return result

@router.post("/")
def add_to_cart(item: CartAdd, db: Session = Depends(get_db)):
    # Check if exists with same product and size
    db_item = db.query(models.CartItem).filter(
        models.CartItem.user_id == item.user_id,
        models.CartItem.product_id == item.product_id,
        models.CartItem.size == item.size
    ).first()
    
    if db_item:
        db_item.quantity += 1
    else:
        db_item = models.CartItem(user_id=item.user_id, product_id=item.product_id, size=item.size, quantity=1)
        db.add(db_item)
    
    db.commit()
    return {"status": "success"}

@router.delete("/{item_id}")
def remove_from_cart(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.CartItem).filter(models.CartItem.id == item_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
    return {"status": "success"}
