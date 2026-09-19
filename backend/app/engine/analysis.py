from fastapi import HTTPException

from app.rag.generate import generate_analysis_report

from app.db.supabase import supabase
from app.engine.financial import (
    calculate_financing_capacity,
    check_project_size,
    route_scheme,
    calculate_working_capital_requirement,
    calculate_loan_repayment,
    stress_test_repayment,
    calculate_milk_collection,
)
from app.engine.feasibility import (
    evaluate_financial_feasibility,
    decision_engine,
    generate_adjustment_warnings,
)
from app.engine.market import (
    process_survey_responses,
    evaluate_market_evidence,
)


def run_analysis(analysis_id):

    analysis_result = (
        supabase
        .table("analyses")
        .select("id, user_id, location_id, business_type")
        .eq("id", str(analysis_id))
        .execute()
    )

    if not analysis_result.data:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )

    analysis = analysis_result.data[0]

    business_result = (
        supabase
        .table("business_inputs")
        .select("*")
        .eq("analysis_id", str(analysis_id))
        .execute()
    )

    if not business_result.data:
        raise HTTPException(
            status_code=404,
            detail="Business information not found"
        )

    business = business_result.data[0]

    inputs = dict(business.get("inputs") or {})

    inputs["available_margin"] = business["capital"]
    inputs["required_project_cost"] = business["expected_investment"]
    inputs["working_capital"] = business.get("working_capital", 0)

    financing = calculate_financing_capacity(
        inputs["available_margin"]
    )

    project_size = check_project_size(
        financing["maximum_project_cost"],
        inputs["required_project_cost"]
    )

    working_capital = calculate_working_capital_requirement(
        inputs["working_capital"]
    )

    scheme = route_scheme(
        inputs["required_project_cost"]
    )

    financial = calculate_milk_collection(inputs)

    repayment = None
    stress_test = None

    if scheme.get("scheme") is not None:

        loan_amount = min(
            inputs["required_project_cost"] * 0.90,
            scheme["maximum_loan"]
        )

        repayment = calculate_loan_repayment(
            loan_amount,
            scheme["interest_rate"],
            scheme["tenure_years"],
            scheme["moratorium_months"]
        )

        stress_test = stress_test_repayment(
            financial["monthly_revenue"],
            financial["monthly_expenses"],
            repayment["monthly_emi"]
        )

    financial_feasibility = evaluate_financial_feasibility(
        financing,
        project_size,
        scheme,
        financial,
        repayment
    )

    adjustment_warnings = generate_adjustment_warnings(
        financing,
        project_size,
        scheme,
        financial,
        repayment
    )

    survey_result = (
        supabase
        .table("survey_responses")
        .select("*")
        .eq("location_id", analysis["location_id"])
        .eq("business_type", analysis["business_type"])
        .execute()
    )

    market_responses = survey_result.data or []

    market_evidence = process_survey_responses(
        market_responses
    )

    market_assessment = evaluate_market_evidence(
        market_evidence
    )

    decision = decision_engine(
        {
            "financial_feasibility": financial_feasibility
        },
        market_assessment
    )

    analysis_data = {
        "analysis_id": str(analysis_id),
        "business": business,
        "financing": financing,
        "project_size": project_size,
        "working_capital": working_capital,
        "scheme": scheme,
        "adjustment_warnings": adjustment_warnings,
        "financial": financial,
        "repayment": repayment,
        "stress_test": stress_test,
        "financial_feasibility": financial_feasibility,
        "market_evidence": market_evidence,
        "market_assessment": market_assessment,
        "decision": decision,
    }

    ai_report = generate_analysis_report(
        analysis_data,
        selected_language="English"
    )

    return {
        **analysis_data,
        "ai_report": ai_report,
    }