from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import UUID

from app.db.supabase import supabase
from app.engine.financial import (
    calculate_milk_collection,
    calculate_financing_capacity,
    check_project_size,
    route_scheme
)


router = APIRouter(
    prefix="/financial",
    tags=["Financial"]
)


class FinancialCalculate(BaseModel):
    analysis_id: UUID
    inputs: dict


@router.post("/calculate")
def calculate_financials(request: FinancialCalculate):

    # Check that the analysis exists
    analysis = (
        supabase.table("analyses")
        .select("id")
        .eq("id", str(request.analysis_id))
        .execute()
    )

    if not analysis.data:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )

    # Calculate financing capacity
    financing = calculate_financing_capacity(
        request.inputs["available_margin"]
    )

    # Check required project size
    project_size = check_project_size(
        financing["maximum_project_cost"],
        request.inputs["required_project_cost"]
    )

    scheme = route_scheme(
    request.inputs["required_project_cost"]
)

    # Calculate business financials
    result = calculate_milk_collection(request.inputs)

    return {
    "analysis_id": str(request.analysis_id),
    "financing": financing,
    "project_size": project_size,
    "scheme": scheme,
    "financial": result
}