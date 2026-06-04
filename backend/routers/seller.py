from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models
import os
import uuid
import base64
import json

router = APIRouter()

class ProductCreate(BaseModel):
    user_id: int # The active seller user id
    name: str
    brand: str
    price: float
    image_b64: str | None = None # Base64 encoded product photo
    image_url: str | None = None # Or direct URL if image is already saved
    category: str
    description: str
    tryOnCompatible: bool = True

class ProductUpdate(BaseModel):
    user_id: int
    name: str
    brand: str
    price: float
    image_b64: str | None = None
    image_url: str | None = None
    category: str
    description: str
    tryOnCompatible: bool = True

class OrderStatusUpdate(BaseModel):
    user_id: int
    status: str

def save_b64_image(b64_data: str, folder: str = "static/uploads/products") -> str:
    os.makedirs(folder, exist_ok=True)
    if "," in b64_data:
        b64_data = b64_data.split(",")[1]
    
    img_data = base64.b64decode(b64_data)
    filename = f"prod_{uuid.uuid4().hex}.png"
    filepath = os.path.join(folder, filename)
    with open(filepath, "wb") as f:
        f.write(img_data)
    return f"/static/uploads/products/{filename}"

@router.get("/products")
def get_seller_products(user_id: int, db: Session = Depends(get_db)):
    products = db.query(models.Product).filter(models.Product.seller_id == user_id).all()
    return products

@router.post("/product")
def create_seller_product(payload: ProductCreate, db: Session = Depends(get_db)):
    # Verify user role
    user = db.query(models.User).filter(models.User.id == payload.user_id).first()
    if not user or user.role not in ("seller", "admin"):
        raise HTTPException(status_code=403, detail="Access denied. Only registered sellers can list products.")

    img_path = payload.image_url or "/static/uploads/products/default.png"
    if payload.image_b64:
        try:
            img_path = save_b64_image(payload.image_b64)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to save product image: {str(e)}")

    new_prod = models.Product(
        id=f"prod_{uuid.uuid4().hex[:8]}",
        name=payload.name,
        brand=payload.brand,
        price=payload.price,
        image=img_path,
        category=payload.category,
        description=payload.description,
        tryOnCompatible=payload.tryOnCompatible,
        seller_id=payload.user_id
    )
    db.add(new_prod)
    db.commit()
    db.refresh(new_prod)
    return new_prod

@router.put("/product/{product_id}")
def update_seller_product(product_id: str, payload: ProductUpdate, db: Session = Depends(get_db)):
    prod = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    if prod.seller_id != payload.user_id:
        raise HTTPException(status_code=403, detail="Unauthorized to edit this product catalog listing")

    img_path = payload.image_url or prod.image
    if payload.image_b64:
        try:
            img_path = save_b64_image(payload.image_b64)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to update product image: {str(e)}")

    prod.name = payload.name
    prod.brand = payload.brand
    prod.price = payload.price
    prod.image = img_path
    prod.category = payload.category
    prod.description = payload.description
    prod.tryOnCompatible = payload.tryOnCompatible

    db.commit()
    db.refresh(prod)
    return prod

@router.delete("/product/{product_id}")
def delete_seller_product(product_id: str, user_id: int, db: Session = Depends(get_db)):
    prod = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    if prod.seller_id != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized to delete this product listing")

    # Optional: clean up file
    if prod.image and prod.image.startswith("/static/uploads/"):
        relative_path = prod.image.lstrip("/")
        if os.path.exists(relative_path):
            try:
                os.remove(relative_path)
            except Exception as e:
                print(f"[WARNING] Failed to remove product file {relative_path}: {e}")

    db.delete(prod)
    db.commit()
    return {"message": "Product listing deleted successfully"}

@router.get("/orders")
def get_seller_orders(user_id: int, db: Session = Depends(get_db)):
    # 1. Fetch all products belonging to this seller
    seller_prods = db.query(models.Product).filter(models.Product.seller_id == user_id).all()
    seller_prod_ids = {p.id for p in seller_prods}

    # 2. Fetch all orders
    all_orders = db.query(models.Order).order_by(models.Order.id.desc()).all()
    
    seller_orders = []
    for order in all_orders:
        try:
            order_items = json.loads(order.items)
        except Exception:
            continue

        # Check if this order contains any products from this seller
        matching_items = [item for item in order_items if item.get("id") in seller_prod_ids]
        
        if matching_items:
            seller_orders.append({
                "id": order.id,
                "user_id": order.user_id,
                "user_name": order.user.name if order.user else "Anonymous",
                "order_date": order.order_date,
                "shipping_address": order.shipping_address,
                "status": order.status,
                "total_order_amount": order.total_amount,
                # Include full list of items, highlighting which ones belong to this seller
                "seller_items": matching_items,
                "all_items": order_items
            })
            
    return seller_orders

@router.put("/order/{order_id}/status")
def update_seller_order_status(order_id: int, payload: OrderStatusUpdate, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order record not found")

    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order

@router.get("/stats")
def get_seller_stats(user_id: int, db: Session = Depends(get_db)):
    # 1. Fetch seller products
    prods = db.query(models.Product).filter(models.Product.seller_id == user_id).all()
    prod_ids = {p.id for p in prods}

    # 2. Fetch all orders to compute stats
    all_orders = db.query(models.Order).all()
    
    total_sales = 0.0
    items_sold = 0
    unique_orders_count = 0

    for order in all_orders:
        try:
            items = json.loads(order.items)
        except Exception:
            continue
        
        matching_items = [item for item in items if item.get("id") in prod_ids]
        if matching_items:
            unique_orders_count += 1
            for item in matching_items:
                quantity = item.get("quantity", 1)
                price = item.get("price", 0.0)
                total_sales += (price * quantity)
                items_sold += quantity

    # 3. Simulate chart data for sales trend (last 6 months)
    sales_trend = [
        {"month": "Jan", "sales": round(total_sales * 0.1, 2)},
        {"month": "Feb", "sales": round(total_sales * 0.15, 2)},
        {"month": "Mar", "sales": round(total_sales * 0.22, 2)},
        {"month": "Apr", "sales": round(total_sales * 0.18, 2)},
        {"month": "May", "sales": round(total_sales * 0.25, 2)},
        {"month": "Jun", "sales": round(total_sales * 0.1, 2)} # current month remainder
    ]

    return {
        "revenue": round(total_sales, 2),
        "items_sold": items_sold,
        "orders_count": unique_orders_count,
        "active_listings": len(prods),
        "sales_trend": sales_trend
    }
