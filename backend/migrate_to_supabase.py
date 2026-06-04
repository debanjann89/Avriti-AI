import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import inspect

# Set up paths so we can import from backend
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

from database import Base
from config import settings
import models

def main():
    # 1. Connect to SQLite source
    sqlite_db_path = os.path.join(backend_dir, "aavriti.db")
    if not os.path.exists(sqlite_db_path):
        print(f"Error: SQLite source database not found at {sqlite_db_path}")
        sys.exit(1)

    print(f"Connecting to source SQLite database: sqlite:///{sqlite_db_path}")
    sqlite_engine = create_engine(f"sqlite:///{sqlite_db_path}")
    SQLiteSession = sessionmaker(bind=sqlite_engine)
    sqlite_session = SQLiteSession()

    # 2. Connect to Supabase target
    postgres_url = settings.DATABASE_URL
    if not postgres_url or "sqlite" in postgres_url or "[PASSWORD]" in postgres_url:
        print("Error: DATABASE_URL in backend/.env is not configured with your actual Supabase password.")
        print("Please replace '[PASSWORD]' in backend/.env with your Supabase database password.")
        sys.exit(1)

    # Output masked connection string
    masked_url = postgres_url.split("@")[-1]
    print(f"Connecting to target Supabase Postgres: postgresql+psycopg2://***:***@{masked_url}")
    
    try:
        pg_engine = create_engine(postgres_url)
        PgSession = sessionmaker(bind=pg_engine)
        pg_session = PgSession()
        
        # Test connection
        conn = pg_engine.connect()
        conn.close()
        print("Successfully connected to Supabase PostgreSQL database.")
    except Exception as e:
        print(f"Database connection error: {e}")
        print("Please check your database password and network connection.")
        sys.exit(1)

    # 3. Create tables in Supabase
    print("\nCreating schema tables on Supabase Postgres...")
    try:
        Base.metadata.create_all(bind=pg_engine)
        print("Schema tables initialized successfully.")
    except Exception as e:
        print(f"Error creating schema tables: {e}")
        sys.exit(1)

    # 4. Migrate tables in logical dependency order
    tables_to_migrate = [
        models.User,
        models.Product,
        models.CartItem,
        models.Order,
        models.SellerApplication,
        models.TryOnImage,
        models.ProductReview,
        models.BlogPost,
        models.SystemSetting
    ]

    print("\nStarting table data migration...")
    
    try:
        for model in tables_to_migrate:
            tablename = model.__tablename__
            print(f"Migrating table '{tablename}'...")
            
            # Check target row count
            existing_count = pg_session.query(model).count()
            if existing_count > 0:
                print(f"  Target '{tablename}' already contains {existing_count} records. Skipping to prevent duplicate key errors.")
                continue
                
            # Get SQLite records
            records = sqlite_session.query(model).all()
            print(f"  Found {len(records)} records in SQLite source.")
            
            if not records:
                continue
                
            # Get model column names dynamically
            inspector = inspect(model)
            columns = [c.key for c in inspector.mapper.column_attrs]
            
            # Transfer rows
            for record in records:
                # Build dict of column values
                data = {col: getattr(record, col) for col in columns}
                # Instantiate new model object
                new_record = model(**data)
                pg_session.add(new_record)
                
            pg_session.commit()
            print(f"  Successfully migrated {len(records)} records for '{tablename}'.")
            
        print("\nAll tables migrated successfully!")

    except Exception as e:
        pg_session.rollback()
        print(f"\nMigration failed: {e}")
        sys.exit(1)
    finally:
        sqlite_session.close()
        pg_session.close()

if __name__ == "__main__":
    main()
