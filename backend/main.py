from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import tryon, auth, products, cart, users, orders, wardrobe, reviews, seller, blog
from database import engine, Base
import os

# Create tables
Base.metadata.create_all(bind=engine)

# Ensure static directories exist
os.makedirs("static/uploads/avatars", exist_ok=True)
os.makedirs("static/uploads/wardrobe", exist_ok=True)
os.makedirs("static/uploads/products", exist_ok=True)

app = FastAPI(title="AvritiAI API", version="1.0.0")

# Serve static uploads
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:5176",
        "http://127.0.0.1:5176",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tryon.router, prefix="/api/tryon", tags=["Virtual Try-On"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(cart.router, prefix="/api/cart", tags=["Cart"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(wardrobe.router, prefix="/api/wardrobe", tags=["Wardrobe"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["Reviews"])
app.include_router(seller.router, prefix="/api/seller", tags=["Seller"])
app.include_router(blog.router, prefix="/api/blog", tags=["Blog"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "AvritiAI"}