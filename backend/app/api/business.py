from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import UUID

from app.db.supabase import supabase

router = APIRouter(prefix="/business", tags=["Business"])

class BusinessCreate(BaseModel):
    analysis_id: UUID
    business_type: str
    business_model: str
    business_name: str | None = None
    location: str
    capital: float
    expected_investment: float
    working_capital: float = 0
    challenges: list[str] = []
    inputs: dict = {}


@router.post("")
def create_business(business: BusinessCreate):

    # Check that the analysis exists
    analysis = (
        supabase
        .table("analyses")
        .select("id")
        .eq("id", str(business.analysis_id))
        .execute()
    )

    if not analysis.data:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )

    # Save business information
    response = (
        supabase
        .table("business_inputs")
        .insert({
            "analysis_id": str(business.analysis_id),
            "business_type": business.business_type,
            "business_model": business.business_model,
            "business_name": business.business_name,
            "location": business.location,
            "capital": business.capital,
            "expected_investment": business.expected_investment,
            "working_capital": business.working_capital,
            "challenges": business.challenges,
            "inputs": business.inputs,
        })
        .execute()
    )

    if not response.data:
        raise HTTPException(
            status_code=400,
            detail="Could not save business information"
        )

    return response.data[0]