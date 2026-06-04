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
        
    conn.commit()
    conn.close()
    print("Database upgrade check completed successfully!")

if __name__ == "__main__":
    upgrade()
