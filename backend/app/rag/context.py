import json

def build_context(
    query,
    retrieved_knowledge,
    business_data=None,
    market_data=None,
    competitors_data=None,
    survey_data=None,
    financial_data=None,
    decision_data=None,
    risks=None,
    daily_target=None,
    today_actual_sales=None,
    today_expenses=None,
    selected_language=None,
):
    context = []

    # User's question
    context.append({
        "section": "user_query",
        "data": query
    })

    # Business information
    if business_data:
        context.append({
            "section": "business",
            "data": business_data
        })

    # Retrieved knowledge
    if retrieved_knowledge:
        context.append({
            "section": "retrieved_knowledge",
            "data": retrieved_knowledge
        })

    # Market evidence
    if market_data:
        context.append({
            "section": "market_evidence",
            "data": market_data
        })

    # Competitor evidence
    if competitors_data:
        context.append({
            "section": "competitor_evidence",
            "data": competitors_data
        })    

    # Survey evidence
    if survey_data:
        context.append({
            "section": "survey_evidence",
            "data": survey_data
        })

    # Financial results
    if financial_data:
        context.append({
            "section": "financial_results",
            "data": financial_data
        })

    # Deterministic decision
    if decision_data:
        context.append({
            "section": "decision",
            "data": decision_data
        })
    #Risks
    if risks:
        context.append({
            "section": "risks",
            "data": risks
        })
    #Daily target
    if daily_target:
        context.append({
            "section": "daily_target",
            "data": daily_target
        })
    #Today's actual sales
    if today_actual_sales:
        context.append({
            "section": "today_actual_sales",
            "data": today_actual_sales
        })
    #Today's expenses
    if today_expenses:
        context.append({
            "section": "today_expenses",
            "data": today_expenses
        })
    #Selected language
    if selected_language:
        context.append({
            "section": "selected_language",
            "data": selected_language
        })       

    return context


def format_context(context):
    return json.dumps(
        context,
        ensure_ascii=False,
        indent=2
    )