import json


def build_context(
    query,
    retrieved_knowledge,
    business_data=None,
    market_data=None,
    financial_data=None,
    decision_data=None,
    scheme_data=None,
    repayment_data=None,
    stress_test_data=None,
    warnings_data=None,
    market_assessment=None,
    selected_language=None,
):
    context = []

    context.append({
        "section": "user_query",
        "data": query
    })

    if business_data:
        context.append({
            "section": "business",
            "data": business_data
        })

    if retrieved_knowledge:
        context.append({
            "section": "retrieved_knowledge",
            "data": retrieved_knowledge
        })

    if market_data:
        context.append({
            "section": "market_evidence",
            "data": market_data
        })

    if market_assessment:
        context.append({
            "section": "market_assessment",
            "data": market_assessment
        })

    if financial_data:
        context.append({
            "section": "financial_results",
            "data": financial_data
        })

    if scheme_data:
        context.append({
            "section": "scheme",
            "data": scheme_data
        })

    if repayment_data:
        context.append({
            "section": "repayment",
            "data": repayment_data
        })

    if stress_test_data:
        context.append({
            "section": "stress_test",
            "data": stress_test_data
        })

    if warnings_data:
        context.append({
            "section": "adjustment_warnings",
            "data": warnings_data
        })

    if decision_data:
        context.append({
            "section": "decision",
            "data": decision_data
        })

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