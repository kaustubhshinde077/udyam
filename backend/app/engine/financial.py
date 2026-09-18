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

def calculate_loan_repayment(
    loan_amount: float,
    annual_interest_rate: float,
    tenure_years: int,
    moratorium_months: int = 0
) -> dict:

    monthly_interest_rate = (
        annual_interest_rate / 100
    ) / 12

    total_months = tenure_years * 12

    repayment_months = total_months - moratorium_months

    if loan_amount <= 0 or repayment_months <= 0:
        return {
            "loan_amount": loan_amount,
            "monthly_emi": None,
            "total_repayment": None,
            "total_interest": None,
            "moratorium_months": moratorium_months,
            "status": "invalid_loan_parameters"
        }

    if monthly_interest_rate == 0:
        monthly_emi = loan_amount / repayment_months
    else:
        monthly_emi = (
            loan_amount
            * monthly_interest_rate
            * (1 + monthly_interest_rate) ** repayment_months
        ) / (
            (1 + monthly_interest_rate) ** repayment_months - 1
        )

    total_repayment = monthly_emi * repayment_months
    total_interest = total_repayment - loan_amount

    return {
        "loan_amount": loan_amount,
        "annual_interest_rate": annual_interest_rate,
        "tenure_years": tenure_years,
        "total_months": total_months,
        "moratorium_months": moratorium_months,
        "repayment_months": repayment_months,
        "monthly_emi": round(monthly_emi, 2),
        "total_repayment": round(total_repayment, 2),
        "total_interest": round(total_interest, 2),
        "status": "calculated"
    }

def generate_repayment_schedule(
    loan_amount: float,
    annual_interest_rate: float,
    tenure_years: int,
    moratorium_months: int = 0
) -> list[dict]:

    monthly_interest_rate = (
        annual_interest_rate / 100
    ) / 12

    total_months = tenure_years * 12
    repayment_months = total_months - moratorium_months

    if loan_amount <= 0 or repayment_months <= 0:
        return []

    if monthly_interest_rate == 0:
        monthly_emi = loan_amount / repayment_months
    else:
        monthly_emi = (
            loan_amount
            * monthly_interest_rate
            * (1 + monthly_interest_rate) ** repayment_months
        ) / (
            (1 + monthly_interest_rate) ** repayment_months - 1
        )

    balance = loan_amount
    schedule = []

    for month in range(1, total_months + 1):

        opening_balance = balance

        if month <= moratorium_months:
            interest = balance * monthly_interest_rate
            principal = 0
            emi = 0
            closing_balance = balance

            moratorium = True

        else:
            interest = balance * monthly_interest_rate
            emi = monthly_emi

            principal = emi - interest

            if principal > balance:
                principal = balance
                emi = principal + interest

            closing_balance = balance - principal

            moratorium = False

        schedule.append({
            "month": month,
            "opening_balance": round(opening_balance, 2),
            "interest": round(interest, 2),
            "principal": round(principal, 2),
            "emi": round(emi, 2),
            "closing_balance": round(closing_balance, 2),
            "moratorium": moratorium
        })

        balance = closing_balance

    return schedule

def generate_quarterly_schedule(
    monthly_schedule: list[dict]
) -> list[dict]:


    quarterly_schedule = []

    for i in range(0, len(monthly_schedule), 3):

        quarter = monthly_schedule[i:i + 3]

        total_interest = sum(
            month["interest"]
            for month in quarter
        )

        total_principal = sum(
            month["principal"]
            for month in quarter
        )

        total_payment = sum(
            month["emi"]
            for month in quarter
        )

        opening_balance = quarter[0]["opening_balance"]
        closing_balance = quarter[-1]["closing_balance"]

        quarterly_schedule.append({
            "quarter": (i // 3) + 1,
            "months": (
                quarter[0]["month"],
                quarter[-1]["month"]
            ),
            "opening_balance": round(
                opening_balance, 2
            ),
            "interest": round(
                total_interest, 2
            ),
            "principal": round(
                total_principal, 2
            ),
            "total_payment": round(
                total_payment, 2
            ),
            "closing_balance": round(
                closing_balance, 2
            ),
            "moratorium": all(
                month["moratorium"]
                for month in quarter
            )
        })

    return quarterly_schedule

def stress_test_repayment(
    monthly_revenue: float,
    monthly_expenses: float,
    monthly_emi: float
) -> dict:

    scenarios = [
        {
            "name": "normal",
            "revenue_change": 0,
            "expense_change": 0
        },
        {
            "name": "revenue_down_10",
            "revenue_change": -0.10,
            "expense_change": 0
        },
        {
            "name": "revenue_down_20",
            "revenue_change": -0.20,
            "expense_change": 0
        },
        {
            "name": "expenses_up_10",
            "revenue_change": 0,
            "expense_change": 0.10
        },
        {
            "name": "combined_stress",
            "revenue_change": -0.20,
            "expense_change": 0.10
        }
    ]

    results = []

    for scenario in scenarios:

        stressed_revenue = (
            monthly_revenue
            * (1 + scenario["revenue_change"])
        )

        stressed_expenses = (
            monthly_expenses
            * (1 + scenario["expense_change"])
        )

        operating_profit = (
            stressed_revenue - stressed_expenses
        )

        cash_after_emi = operating_profit - monthly_emi

        results.append({
            "scenario": scenario["name"],
            "revenue": round(stressed_revenue, 2),
            "expenses": round(stressed_expenses, 2),
            "operating_profit": round(operating_profit, 2),
            "emi": round(monthly_emi, 2),
            "cash_after_emi": round(cash_after_emi, 2),
            "can_repay": cash_after_emi >= 0
        })

    return {
        "monthly_revenue": monthly_revenue,
        "monthly_expenses": monthly_expenses,
        "monthly_emi": monthly_emi,
        "scenarios": results
    }

def calculate_working_capital_requirement(
    working_capital: float
) -> dict:

    if working_capital < 0:
        return {
            "working_capital": working_capital,
            "status": "invalid"
        }

    return {
        "working_capital": working_capital,
        "status": "calculated"
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