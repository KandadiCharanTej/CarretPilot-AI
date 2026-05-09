from app.db.supabase import supabase

try:
    print("Testing Supabase connection...")
    data = supabase.table("users").select("*").execute()
    print("Connection successful!")
    print(f"Data: {data.data}")
except Exception as e:
    print(f"Connection Error: {e}")
