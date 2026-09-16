def calculate_financing_capacity(available_margin: float) -> dict:
    maximum_project_cost = available_margin / 0.10
    maximum_loan = maximum_project_cost * 0.90

    return {
        "available_margin": available_margin,
        "maximum_project_cost": maximum_project_cost,
        "maximum_loan": maximum_loan,
    }

def check_project_size(maximum_project_cost: float, required_project_cost: float) -> dict:
    if required_project_cost <= maximum_project_cost:
        return {
            "status": "within_capacity",
            "maximum_project_cost": maximum_project_cost,
            "required_project_cost": required_project_cost,
            "resize_required": False,
        }

    return {
        "status": "exceeds_capacity",
        "maximum_project_cost": maximum_project_cost,
        "required_project_cost": required_project_cost,
        "resize_required": True,
    }

def route_scheme(project_cost: float) -> dict:
    if project_cost <= 140000:
        return {
            "scheme": "Micro Finance",
            "interest_rate": 6.5,
            "tenure_years": 3,
            "moratorium_months": 3,
            "maximum_loan": 125000,
        }

    if project_cost <= 5000000:
        return {
            "scheme": "Term Loan",
            "interest_rate": 8.0,
            "tenure_years": 7,
            "moratorium_months": 6,
            "maximum_loan": 4500000,
        }

    return {
        "scheme": None,
        "status": "not_eligible",
    }    

def calculate_milk_collection(inputs: dict) -> dict:
    litres = inputs["expected_daily_collection_litres"]
    purchase_price = inputs["purchase_price_per_litre"]
    selling_price = inputs["selling_price_per_litre"]

    labour_count = inputs["labour_count"]
    labour_cost_per_worker = inputs["labour_cost_per_day"]

    transport_cost = inputs["transport_cost_per_day"]

    daily_revenue = litres * selling_price
    daily_milk_cost = litres * purchase_price
    daily_labour_cost = labour_count * labour_cost_per_worker

    daily_expenses = (
        daily_milk_cost
        + daily_labour_cost
        + transport_cost
    )

    daily_profit = daily_revenue - daily_expenses

    monthly_revenue = daily_revenue * 30
    monthly_expenses = daily_expenses * 30
    monthly_profit = daily_profit * 30

    profit_margin = (
        (daily_profit / daily_revenue) * 100
        if daily_revenue > 0
        else 0
    )

    return {
        "daily_revenue": daily_revenue,
        "daily_milk_cost": daily_milk_cost,
        "daily_labour_cost": daily_labour_cost,
        "daily_transport_cost": transport_cost,
        "daily_expenses": daily_expenses,
        "daily_profit": daily_profit,
        "monthly_revenue": monthly_revenue,
        "monthly_expenses": monthly_expenses,
        "monthly_profit": monthly_profit,
        "profit_margin_percent": profit_margin,
    }