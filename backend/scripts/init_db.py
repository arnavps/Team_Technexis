import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# The specific DB URL provided by the user
DB_URL = "postgresql://postgres.xqsancvpphgtfucdpqls:Team_Technexis12345@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

def init_db():
    try:
        print(f"Connecting to database...")
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        # Create profiles table
        print("Creating profiles table...")
        cur.execute("""
            CREATE TABLE IF NOT EXISTS profiles (
                phone VARCHAR(20) PRIMARY KEY,
                name VARCHAR(255),
                crop VARCHAR(100),
                land_size_acres FLOAT,
                latitude FLOAT,
                longitude FLOAT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        conn.commit()
        print("Database initialized successfully!")
        
    except Exception as e:
        print(f"Database error: {e}")
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    init_db()
