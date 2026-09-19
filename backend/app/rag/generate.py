import json
import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.rag.retrieve import retrieve
from app.rag.context import build_context, format_context


load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env")

client = genai.Client(api_key=API_KEY)


SYSTEM_INSTRUCTION = """
You are Udyam AI, an assistant for micro-entrepreneurs.

Use ONLY the information provided in the retrieved knowledge.

Rules:
- Do not invent market evidence, survey results, financial figures,
  government schemes, or business facts.
- Do not calculate or modify financial results.
- Do not make final business decisions.
- If required information is unavailable, clearly say so.
- Give practical and simple explanations.
- Answer in the same language as the user's question when possible.
"""


RESPONSE_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "answer": {"type": "STRING"},
        "key_points": {
            "type": "ARRAY",
            "items": {"type": "STRING"}
        },
        "evidence_used": {
            "type": "ARRAY",
            "items": {"type": "STRING"}
        },
        "next_actions": {
            "type": "ARRAY",
            "items": {"type": "STRING"}
        }
    },
    "required": [
        "answer",
        "key_points",
        "evidence_used",
        "next_actions"
    ]
}


def generate_answer(question: str, top_k: int = 3):

    results = retrieve(question, top_k=top_k)

    context = json.dumps(
        results,
        ensure_ascii=False,
        indent=2
    )

    prompt = f"""
Retrieved knowledge:

{context}

User question:
{question}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            response_schema=RESPONSE_SCHEMA,
            temperature=0.2,
        )
    )

    return json.loads(response.text)


ANALYSIS_REPORT_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "feasibility_report": {
            "type": "OBJECT",
            "properties": {
                "summary": {"type": "STRING"},
                "market_analysis": {"type": "STRING"},
                "decision_explanation": {"type": "STRING"},
                "warnings": {
                    "type": "ARRAY",
                    "items": {"type": "STRING"}
                },
                "next_steps": {
                    "type": "ARRAY",
                    "items": {"type": "STRING"}
                }
            },
            "required": [
                "summary",
                "market_analysis",
                "decision_explanation",
                "warnings",
                "next_steps"
            ]
        },
        "financial_report": {
            "type": "OBJECT",
            "properties": {
                "summary": {"type": "STRING"},
                "financing": {"type": "STRING"},
                "scheme": {"type": "STRING"},
                "repayment": {"type": "STRING"},
                "cash_flow_and_stress": {"type": "STRING"},
                "key_figures": {
                    "type": "OBJECT",
                    "properties": {
                        "available_margin": {"type": "NUMBER"},
                        "maximum_project_cost": {"type": "NUMBER"},
                        "required_project_cost": {"type": "NUMBER"},
                        "loan_amount": {"type": "NUMBER"},
                        "monthly_revenue": {"type": "NUMBER"},
                        "monthly_expenses": {"type": "NUMBER"},
                        "monthly_profit": {"type": "NUMBER"},
                        "monthly_emi": {"type": "NUMBER"}
                    },
                    "required": [
                        "available_margin",
                        "maximum_project_cost",
                        "required_project_cost",
                        "loan_amount",
                        "monthly_revenue",
                        "monthly_expenses",
                        "monthly_profit",
                        "monthly_emi"
                    ]
                }
            },
            "required": [
                "summary",
                "financing",
                "scheme",
                "repayment",
                "cash_flow_and_stress",
                "key_figures"
            ]
        }
    },
    "required": [
        "feasibility_report",
        "financial_report"
    ]
}


def generate_analysis_report(
    analysis_data,
    selected_language=None
):

    business = analysis_data.get("business", {})
    market_evidence = analysis_data.get("market_evidence", {})
    market_assessment = analysis_data.get("market_assessment", {})
    financial = analysis_data.get("financial", {})
    financing = analysis_data.get("financing", {})
    project_size = analysis_data.get("project_size", {})
    scheme = analysis_data.get("scheme", {})
    repayment = analysis_data.get("repayment")
    stress_test = analysis_data.get("stress_test")
    warnings = analysis_data.get("adjustment_warnings", [])
    decision = analysis_data.get("decision", {})

    query = f"Generate the final Udyam business analysis report for {business.get('business_name', 'the proposed business')}."

    results = retrieve(
        f"{business.get('business_type', '')} business analysis and risks"
    )

    context = build_context(
        query=query,
        retrieved_knowledge=results,
        business_data=business,
        market_data=market_evidence,
        financial_data={
            "financing": financing,
            "project_size": project_size,
            "financial": financial,
            "scheme": scheme,
            "repayment": repayment,
            "stress_test": stress_test,
            "warnings": warnings
        },
        decision_data=decision,
        market_assessment=market_assessment,
        selected_language=selected_language
    )

    formatted_context = format_context(context)

    system_instruction = """
You are Udyam AI, the explanation and reporting layer of the Udyam system.

Your task is to explain the structured analysis already calculated by the backend.

STRICT RULES:
- Do not calculate financial values.
- Do not modify financial values.
- Do not change the deterministic decision.
- Do not invent market evidence.
- Do not invent survey results.
- Do not invent government schemes or scheme terms.
- Use retrieved knowledge only for general business explanation.
- Treat survey and market evidence as reported evidence, not guaranteed demand.
- Preserve UNKNOWN evidence status exactly.
- Explain RESIZE as the existing system decision; do not invent an automatic resizing solution.
- Do not treat warnings as decisions.
- Do not introduce unsupported facts.
- Use simple language suitable for a first-time entrepreneur.
- Generate the report in the requested language when provided.
"""

    prompt = f"""
Generate the final Udyam analysis report from the following context.

CONTEXT:
{formatted_context}

REPORT REQUIREMENTS:

FEASIBILITY REPORT:
- Explain the local market evidence.
- Mention sample size and important observed evidence.
- Explain competition and unmet/supply-gap evidence.
- Explain the deterministic decision exactly as provided.
- Explain warnings clearly.
- Provide practical next steps based only on the provided evidence.

FINANCIAL REPORT:
- Explain available margin and financing capacity.
- Explain proposed project cost.
- Explain the applicable scheme and provided terms.
- Explain repayment information.
- Explain revenue, expenses, profit and stress-test results.
- Use the supplied numbers exactly.

The report must clearly distinguish:
1. Calculated facts
2. Survey/market evidence
3. General business knowledge
4. Deterministic decision

Selected language:
{selected_language or "English"}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            response_schema=ANALYSIS_REPORT_SCHEMA,
            temperature=0.2,
        )
    )

    return json.loads(response.text)