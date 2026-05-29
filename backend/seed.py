from database import SessionLocal, engine, Base
from models import Product

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# We no longer preload any default products to keep the store customizable.
products = []

for p in products:
    db_product = Product(**p)
    db.merge(db_product)

db.commit()
db.close()
print("Seeded database!")
