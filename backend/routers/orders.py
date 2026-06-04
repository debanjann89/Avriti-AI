from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models
import json
import datetime

router = APIRouter()

class OrderCheckout(BaseModel):
    user_id: int
    shipping_address: str = None

@router.post("/")
def checkout_cart(data: OrderCheckout, db: Session = Depends(get_db)):
    # 1. Fetch user's cart
    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == data.user_id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
        
    # 2. Get user info
    user = db.query(models.User).filter(models.User.id == data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    shipping_addr = data.shipping_address or user.shipping_address or "No address provided"
    
    # 3. Formulate purchased items list & total price
    purchased_items = []
    total_amount = 0.0
    
    for item in cart_items:
        prod = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if prod:
            item_total = prod.price * item.quantity
            total_amount += item_total
            purchased_items.append({
                "id": prod.id,
                "name": prod.name,
                "brand": prod.brand,
                "price": prod.price,
                "quantity": item.quantity,
                "size": item.size or "M",
                "image": prod.image
            })
            
    if not purchased_items:
        raise HTTPException(status_code=400, detail="None of the products in your cart exist in the catalog")
        
    # 4. Create new Order in database
    new_order = models.Order(
        user_id=data.user_id,
        order_date=datetime.datetime.now().strftime("%d %b %Y, %I:%M %p"),
        total_amount=total_amount,
        status="Processing",
        items=json.dumps(purchased_items),
        shipping_address=shipping_addr
    )
    db.add(new_order)
    
    # 5. Clear cart
    for item in cart_items:
        db.delete(item)
        
    db.commit()
    db.refresh(new_order)
    
    return {
        "id": new_order.id,
        "order_date": new_order.order_date,
        "total_amount": new_order.total_amount,
        "status": new_order.status,
        "shipping_address": new_order.shipping_address,
        "items": purchased_items
    }

class OrderStatusUpdateAdmin(BaseModel):
    status: str

@router.get("/")
def get_all_orders(db: Session = Depends(get_db)):
    orders = db.query(models.Order).order_by(models.Order.id.desc()).all()
    
    result = []
    for order in orders:
        try:
            items_list = json.loads(order.items)
        except:
            items_list = []
            
        user = db.query(models.User).filter(models.User.id == order.user_id).first()
        
        result.append({
            "id": order.id,
            "user_id": order.user_id,
            "user_name": user.name if user else "Anonymous",
            "user_email": user.email if user else "N/A",
            "user_phone": user.phone if user else "N/A",
            "order_date": order.order_date,
            "total_amount": order.total_amount,
            "status": order.status,
            "shipping_address": order.shipping_address,
            "items": items_list
        })
        
    return result

@router.put("/{order_id}/status")
def update_order_status(order_id: int, payload: OrderStatusUpdateAdmin, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order

@router.get("/{user_id}")
def get_order_history(user_id: int, db: Session = Depends(get_db)):
    orders = db.query(models.Order).filter(models.Order.user_id == user_id).order_by(models.Order.id.desc()).all()
    
    result = []
    for order in orders:
        try:
            items_list = json.loads(order.items)
        except:
            items_list = []
            
        result.append({
            "id": order.id,
            "order_date": order.order_date,
            "total_amount": order.total_amount,
            "status": order.status,
            "shipping_address": order.shipping_address,
            "items": items_list
        })
        
    return result
