import sqlite3
import os

def upgrade():
    db_path = "aavriti.db"
    if not os.path.exists(db_path):
        print(f"Database {db_path} does not exist yet. It will be created by main.py.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Check if products table has seller_id column
    cursor.execute("PRAGMA table_info(products)")
    columns = [row[1] for row in cursor.fetchall()]
    
    if "seller_id" not in columns:
        print("Adding seller_id column to products table...")
        cursor.execute("ALTER TABLE products ADD COLUMN seller_id INTEGER REFERENCES users(id)")
        print("seller_id column added successfully!")
    else:
        print("seller_id column already exists in products table.")

    if "images" not in columns:
        print("Adding images column to products table...")
        cursor.execute("ALTER TABLE products ADD COLUMN images TEXT")
        print("images column added successfully!")
    else:
        print("images column already exists in products table.")

    # Extended specifications columns
    extra_cols = {
        "fabric": "TEXT",
        "craft_technique": "TEXT",
        "wash_care": "TEXT",
        "country_of_origin": "TEXT",
        "external_url": "TEXT"
    }
    for col, col_type in extra_cols.items():
        if col not in columns:
            print(f"Adding {col} column to products table...")
            cursor.execute(f"ALTER TABLE products ADD COLUMN {col} {col_type}")
            print(f"{col} column added successfully!")
        else:
            print(f"{col} column already exists in products table.")
        
    # Check if cart_items table has size column
    cursor.execute("PRAGMA table_info(cart_items)")
    cart_columns = [row[1] for row in cursor.fetchall()]
    if "size" not in cart_columns:
        print("Adding size column to cart_items table...")
        cursor.execute("ALTER TABLE cart_items ADD COLUMN size TEXT DEFAULT 'M'")
        print("size column added successfully!")
    else:
        print("size column already exists in cart_items table.")
        
    conn.commit()
    conn.close()
    print("Database upgrade check completed successfully!")

if __name__ == "__main__":
    upgrade()
