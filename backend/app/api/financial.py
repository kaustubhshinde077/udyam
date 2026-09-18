from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from uuid import UUID

from app.db.supabase import supabase
from app.engine.financial import (
    calculate_milk_collection,
    calculate_financing_capacity,
    check_project_size,
    route_scheme,
    calculate_working_capital_requirement,
    calculate_loan_repayment,
    generate_repayment_schedule,
    stress_test_repayment
)

from app.engine.feasibility import evaluate_financial_feasibility

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

    # Calculate working capital requirement
    working_capital_result = calculate_working_capital_requirement(
        request.inputs["working_capital"]
    )

    # Select applicable scheme
    scheme = route_scheme(
        request.inputs["required_project_cost"]
    )

    # Calculate business financials
    result = calculate_milk_collection(
        request.inputs
    )

    repayment = None
    monthly_schedule = []
    stress_test = None

    # Calculate repayment only when a valid scheme exists
    if scheme.get("scheme") is not None:

        loan_amount = min(
            request.inputs["required_project_cost"] * 0.90,
            scheme["maximum_loan"]
        )

        repayment = calculate_loan_repayment(
            loan_amount,
            scheme["interest_rate"],
            scheme["tenure_years"],
            scheme["moratorium_months"]
        )

        # Keep full schedule calculation available internally
        monthly_schedule = generate_repayment_schedule(
            loan_amount,
            scheme["interest_rate"],
            scheme["tenure_years"],
            scheme["moratorium_months"]
        )

        stress_test = stress_test_repayment(
            result["monthly_revenue"],
            result["monthly_expenses"],
            repayment["monthly_emi"]
        )

    # Evaluate financial feasibility
    financial_feasibility = evaluate_financial_feasibility(
        financing,
        project_size,
        scheme,
        result,
        repayment
    )

    return {
        "analysis_id": str(request.analysis_id),
        "financing": financing,
        "project_size": project_size,
        "working_capital": working_capital_result,
        "scheme": scheme,
        "financial": result,
        "repayment": repayment,
        "stress_test": stress_test,
        "financial_feasibility": financial_feasibility
    }