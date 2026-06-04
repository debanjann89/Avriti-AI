from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    role = Column(String, default="buyer")  # "buyer", "seller", "admin"
    profile_picture = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    shipping_address = Column(String, nullable=True)
    
    # Sizing profile parameters
    height = Column(String, nullable=True)
    weight = Column(String, nullable=True)
    body_type = Column(String, nullable=True)
    shoulder_width = Column(String, nullable=True)
    waist_size = Column(String, nullable=True)

    cart_items = relationship("CartItem", back_populates="user")
    orders = relationship("Order", back_populates="user")


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    brand = Column(String)
    price = Column(Float)
    image = Column(String)
    category = Column(String)
    description = Column(String)
    tryOnCompatible = Column(Boolean, default=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Extended product details
    fabric = Column(String, nullable=True)
    craft_technique = Column(String, nullable=True)
    wash_care = Column(String, nullable=True)
    country_of_origin = Column(String, nullable=True)
    external_url = Column(String, nullable=True)

    cart_items = relationship("CartItem", back_populates="product")


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(String, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)

    user = relationship("User", back_populates="cart_items")
    product = relationship("Product", back_populates="cart_items")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    order_date = Column(String)
    total_amount = Column(Float)
    status = Column(String, default="Processing")
    items = Column(String)  # JSON text holding array of purchased item details
    shipping_address = Column(String, nullable=True)

    user = relationship("User", back_populates="orders")


class SellerApplication(Base):
    __tablename__ = "seller_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    store_name = Column(String)
    store_description = Column(String)
    business_email = Column(String)
    business_phone = Column(String)
    product_category = Column(String)
    status = Column(String, default="pending")  # "pending", "approved", "rejected"
    rejection_reason = Column(String, nullable=True)
    submitted_at = Column(String)

    user = relationship("User")


class TryOnImage(Base):
    __tablename__ = "tryon_images"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    image_url = Column(String)
    product_id = Column(String, ForeignKey("products.id"), nullable=True)
    created_at = Column(String)

    user = relationship("User")


class ProductReview(Base):
    __tablename__ = "product_reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(String, ForeignKey("products.id"))
    rating = Column(Integer)  # 1 to 5 stars
    comment = Column(String)
    tryon_image_url = Column(String, nullable=True)  # Optional attached wardrobe try-on photo
    created_at = Column(String)

    user = relationship("User")
    product = relationship("Product")


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    excerpt = Column(String)
    content = Column(String)
    category = Column(String)
    read_time = Column(String)  # Maps readTime in JS
    date = Column(String)
    author = Column(String)
    image = Column(String)
    interactive_text = Column(String, nullable=True)  # Maps interactiveText in JS
    interactive_link = Column(String, nullable=True)  # Maps interactiveLink in JS


class SystemSetting(Base):
    __tablename__ = "system_settings"

    key = Column(String, primary_key=True, index=True)
    value = Column(String)


