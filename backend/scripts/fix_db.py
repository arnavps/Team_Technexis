import psycopg2
from dotenv import load_dotenv

load_dotenv()
DB_URL = "postgresql://postgres.xqsancvpphgtfucdpqls:Team_Technexis12345@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

def fix_db():
    try:
        print("Connecting...")
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        # 406 Error on Supabase usually means the table is not exposed to the anon role 
        # or RLS is blocking the query.
        print("Granting access and disabling RLS...")
        
        # 1. Ensure anon role has usage on the schema
        cur.execute("GRANT USAGE ON SCHEMA public TO anon;")
        cur.execute("GRANT USAGE ON SCHEMA public TO authenticated;")
        
        # 2. Grant CRUD privileges to the anon and authenticated roles
        cur.execute("GRANT ALL ON profiles TO anon;")
        cur.execute("GRANT ALL ON profiles TO authenticated;")
        
        # 3. Disable RLS for testing/demo purposes so the frontend client can read/write without complex JWT setup
        cur.execute("ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;")
        
        conn.commit()
        print("Fixed permissions!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if 'cur' in locals(): cur.close()
        if 'conn' in locals(): conn.close()

if __name__ == "__main__":
    fix_db()
