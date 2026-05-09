from fastapi import APIRouter
from app.schemas.user_schema import UserCreate
from app.db.supabase import supabase

router = APIRouter()

@router.get("/test")
def test_auth():
    return {
        "message": "Auth route working"
    }

@router.post("/register")
def register(user: UserCreate):
    data = supabase.table("users").insert({
        "name": user.name,
        "email": user.email
    }).execute()
    return data.data
