def check_financial_feasibility(
    monthly_profit: float,
    required_project_cost: float,
    maximum_project_cost: float
) -> dict:

    business_viable = monthly_profit > 0
    financing_available = (
        required_project_cost <= maximum_project_cost
    )

    return {
        "business_viable": business_viable,
        "financing_available": financing_available,
        "feasible": business_viable and financing_available
    }


def evaluate_financial_feasibility(
    financing: dict,
    project_size: dict,
    scheme: dict,
    financial: dict,
    repayment: dict | None
) -> dict:

    if project_size["resize_required"]:
        return {
            "decision": "RESIZE",
            "reason": "Required project cost exceeds financing capacity.",
            "financial_status": "sufficient"
        }

    if scheme.get("scheme") is None:
        return {
            "decision": "NO",
            "reason": "Project is not eligible for an available scheme.",
            "financial_status": "sufficient"
        }

    if financial["monthly_profit"] <= 0:
        return {
            "decision": "NO",
            "reason": "Business does not generate a positive monthly profit.",
            "financial_status": "sufficient"
        }

    if (
        repayment is None
        or financial["monthly_profit"] < repayment["monthly_emi"]
    ):
        return {
            "decision": "RESIZE",
            "reason": "Monthly profit is insufficient to cover the loan EMI.",
            "financial_status": "sufficient"
        }

    return {
        "decision": "VIABLE",
        "reason": (
            "Project is within financing capacity and "
            "can cover the estimated loan EMI."
        ),
        "financial_status": "sufficient"
    }

def generate_adjustment_warnings(
    financing: dict,
    project_size: dict,
    scheme: dict,
    financial: dict,
    repayment: dict | None
) -> list:

    warnings = []

    if project_size["resize_required"]:
        warnings.append({
            "type": "PROJECT_COST",
            "severity": "warning",
            "message": "Your proposed project cost exceeds your financing capacity.",
            "details": {
                "proposed_cost": project_size["required_project_cost"],
                "maximum_cost": financing["maximum_project_cost"],
                "excess_amount": (
                    project_size["required_project_cost"]
                    - financing["maximum_project_cost"]
                )
            },
            "action": (
                "Consider reducing the proposed project cost "
                "or increasing your available margin."
            )
        })

    if scheme.get("scheme") is None:
        warnings.append({
            "type": "SCHEME",
            "severity": "warning",
            "message": "Your proposed project does not fall within the available scheme limits.",
            "action": "Review the proposed project cost."
        })

    if financial["monthly_profit"] <= 0:
        warnings.append({
            "type": "PROFIT",
            "severity": "warning",
            "message": "The estimated business profit is not positive.",
            "details": {
                "monthly_profit": financial["monthly_profit"]
            },
            "action": (
                "Review expected revenue and operating expenses "
                "before proceeding."
            )
        })

    elif (
        repayment is not None
        and financial["monthly_profit"] < repayment["monthly_emi"]
    ):
        warnings.append({
            "type": "EMI",
            "severity": "warning",
            "message": "The estimated monthly profit is insufficient to cover the loan EMI.",
            "details": {
                "monthly_profit": financial["monthly_profit"],
                "monthly_emi": repayment["monthly_emi"],
                "shortfall": (
                    repayment["monthly_emi"]
                    - financial["monthly_profit"]
                )
            },
            "action": (
                "Review the project cost, expected revenue, "
                "or operating expenses."
            )
        })

    return warnings

def decision_engine(
    financial_result: dict,
    market_evidence: dict
) -> dict:

    financial_decision = financial_result.get(
        "financial_feasibility", {}
    )

    financial_status = financial_decision.get(
        "financial_status",
        "unknown"
    )

    decision = financial_decision.get(
        "decision",
        "NO"
    )

    market_status = market_evidence.get(
        "market_status",
        "UNKNOWN"
    )

    evidence_coverage = market_evidence.get(
        "evidence_coverage",
        "LIMITED"
    )

    if decision == "NO":
        reason = financial_decision.get(
            "reason",
            "Project is not financially feasible."
        )

    elif decision == "RESIZE":
        reason = financial_decision.get(
            "reason",
            "Project requires resizing."
        )

    else:
        decision = "VIABLE"

        if evidence_coverage == "STRONG":
            reason = (
                "Project is financially feasible with "
                "broad market evidence coverage."
            )

        elif evidence_coverage == "MODERATE":
            reason = (
                "Project is financially feasible, "
                "but market evidence coverage is moderate."
            )

        else:
            reason = (
                "Project is financially feasible, "
                "but market evidence coverage is limited "
                "and requires further validation."
            )

    return {
    "decision": decision,
    "reason": reason,
    "financial_status": financial_status,
    "market_status": market_status,
    "evidence_coverage": evidence_coverage
    }