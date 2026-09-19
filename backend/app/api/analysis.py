from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import UUID

from app.engine.analysis import run_analysis

from app.db.supabase import supabase

router = APIRouter(prefix="/analysis", tags=["Analysis"])


class AnalysisCreate(BaseModel):
    user_id: UUID
    location_id: UUID
    business_type: str


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

    # Check that the location exists
    location = (
        supabase
        .table("locations")
        .select("id")
        .eq("id", str(analysis.location_id))
        .execute()
    )

    if not location.data:
        raise HTTPException(
            status_code=400,
            detail="Invalid location_id"
        )

    # Create a new analysis
    response = (
        supabase
        .table("analyses")
        .insert({
            "user_id": str(analysis.user_id),
            "location_id": str(analysis.location_id),
            "business_type": analysis.business_type,
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


@router.post("/{analysis_id}/run")
def run_analysis_endpoint(analysis_id: UUID):

    return run_analysis(analysis_id)