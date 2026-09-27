import json

from app.rag.retrieve import retrieve
from app.rag.generate import client, SYSTEM_INSTRUCTION, RESPONSE_SCHEMA
from google.genai import types


def explain_market(
    crop: str,
    question: str,
    location_context: str | None = None,
    top_k: int = 3
):
    crop_clean = crop.lower().strip()
    target_source = f"market_trends_{crop_clean}.json"

    specialized_question = (
        f"Act as an expert Agricultural Market and Seasonal Price Advisor "
        f"for Indian smallholders. "
        f"Provide strategic guidance on price trends, optimal selling or "
        f"storage windows, APMC arrival cycles, and market risks for {crop}. "
        f"Location context: {location_context or 'Maharashtra'}. "
        f"Question: {question}"
    )

    docs = retrieve(
        specialized_question,
        top_k=top_k * 2
    )

    filtered_docs = [
        doc for doc in docs
        if target_source in doc.get("metadata", {}).get("source", "")
    ]

    context_docs = (filtered_docs if filtered_docs else docs)[:top_k]

    context = json.dumps(
        context_docs,
        ensure_ascii=False,
        indent=2
    )

    prompt = f"""
Retrieved market knowledge:

{context}

User question:
{question}

Crop:
{crop}

Location:
{location_context or "Maharashtra"}
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            response_schema=RESPONSE_SCHEMA,
            temperature=0.2,
        )
    )

    return {
        "context_docs": context_docs,
        "answer": json.loads(response.text)
    }