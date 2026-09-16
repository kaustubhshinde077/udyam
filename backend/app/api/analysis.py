from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import UUID

from app.db.supabase import supabase

router = APIRouter(prefix="/analysis", tags=["Analysis"])


class AnalysisCreate(BaseModel):
    user_id: UUID


@router.post("")
def create_analysis(analysis: AnalysisCreate):

    # Check that the user exists
    user = (
        supabase
        .table("users")
        .select("id")
        .eq("id", str(analysis.user_id))
        .execute()
    )

    if not user.data:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Create a new analysis
    response = (
        supabase
        .table("analyses")
        .insert({
            "user_id": str(analysis.user_id),
            "status": "created"
        })
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=400,
            detail="Could not create analysis"
        )

    return response.data[0]