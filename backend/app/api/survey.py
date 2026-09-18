from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from uuid import UUID

from app.engine.market import (
    process_survey_responses,
    evaluate_market_evidence
)

from app.db.supabase import supabase

router = APIRouter(
    prefix="/survey",
    tags=["Survey"]
)


class SurveyResponse(BaseModel):
    # Location
    location_id: UUID
    village: str
    block: Optional[str] = None
    district: str

    # Business category being evaluated
    business_type: str

    # Actual demand
    purchase_frequency: Optional[str] = None
    typical_spending: Optional[float] = None

    # Local availability
    purchase_location: Optional[str] = None

    # Competitors / existing businesses
    usual_business_name: Optional[str] = None
    other_business_names: list[str] = []

    # Unmet local demand
    difficult_to_find_products: list[str] = []
    desired_local_business: Optional[str] = None

    # Problems with existing supply
    local_problems: list[str] = []
    biggest_local_problem: Optional[str] = None

    # Outside-area demand
    travel_outside_area: bool = False
    outside_area_product: Optional[str] = None

    # Pricing / purchasing behaviour
    current_price: Optional[float] = None
    too_expensive_price: Optional[float] = None
    purchase_priority: Optional[str] = None

    # Seasonality
    seasonal_demand: Optional[str] = None
    high_demand_change: Optional[str] = None

    # Distribution
    preferred_distribution_channel: Optional[str] = None

    # Category-specific questions
    category_inputs: dict = {}


@router.post("/response")
def submit_survey(response: SurveyResponse):

    survey_data = response.model_dump()
    survey_data["location_id"] = str(response.location_id)

    location = (
    supabase
    .table("locations")
    .select("id")
    .eq("id", str(response.location_id))
    .execute()
    )

    if not location.data:
        raise HTTPException(
        status_code=400,
        detail="Invalid location_id"
    )

    result = (
        supabase
        .table("survey_responses")
        .insert(survey_data)
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=500,
            detail="Failed to save survey response"
        )

    return {
        "status": "saved",
        "survey": result.data[0]
    }

@router.get("/market/{location_id}/{business_type}")
def get_market_evidence(
    location_id: UUID,
    business_type: str
):
    result = (
        supabase
        .table("survey_responses")
        .select("*")
        .eq("location_id", str(location_id))
        .eq("business_type", business_type)
        .execute()
    )

    responses = result.data or []

    evidence = process_survey_responses(responses)
    market_assessment = evaluate_market_evidence(evidence)

    return {
        "location_id": str(location_id),
        "business_type": business_type,
        "evidence": evidence,
        "market_assessment": market_assessment
    }