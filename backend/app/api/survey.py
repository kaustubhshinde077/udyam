from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.db.supabase import supabase

router = APIRouter(
    prefix="/survey",
    tags=["Survey"]
)


class SurveyResponse(BaseModel):
    village: str
    block: Optional[str] = None
    district: str

    business_type: str

    purchase_frequency: Optional[str] = None
    typical_spending: Optional[float] = None
    purchase_location: Optional[str] = None

    preferred_distribution_channel: Optional[str] = None

    usual_business_name: Optional[str] = None
    other_business_names: list[str] = []

    difficult_to_find_products: list[str] = []
    local_problems: list[str] = []

    travel_outside_area: bool = False
    outside_area_product: Optional[str] = None

    current_price: Optional[float] = None
    too_expensive_price: Optional[float] = None
    purchase_priority: Optional[str] = None

    seasonal_demand: Optional[str] = None
    high_demand_change: Optional[str] = None

    biggest_local_problem: Optional[str] = None

    category_inputs: dict = {}


@router.post("/response")
def submit_survey(response: SurveyResponse):

    survey_data = response.model_dump()

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