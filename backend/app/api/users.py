from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.db.supabase import supabase

router = APIRouter(prefix="/users", tags=["Users"])


class UserCreate(BaseModel):
    name: str
    mobile: str


@router.post("")
def create_user(user: UserCreate):

    # Check if mobile number already exists
    existing = (
        supabase
        .table("users")
        .select("id")
        .eq("mobile", user.mobile)
        .execute()
    )

    if existing.data:
        raise HTTPException(
            status_code=409,
            detail="This mobile number is already registered."
        )

    # Create new user
    response = (
        supabase
        .table("users")
        .insert({
            "name": user.name,
            "mobile": user.mobile,
        })
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=400,
            detail="Could not create user"
        )

    return response.data[0]