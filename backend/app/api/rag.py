from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from app.rag.retrieve import retrieve
from app.rag.generate import generate_answer
from app.rag.market_explainer import explain_market


router = APIRouter(prefix="/rag", tags=["RAG"])


class RAGQuery(BaseModel):
    question: str
    top_k: int = 3


class FarmingAdvisorQuery(BaseModel):
    question: str
    location_context: str | None = None
    top_k: int = 3


class MarketExplainerQuery(BaseModel):
    question: str
    crop: str  # e.g., "onion", "pomegranate", "grapes", "corn"
    location_context: str | None = None
    top_k: int = 3


@router.post("/query")
def rag_query(request: RAGQuery):
    results = retrieve(
        request.question,
        top_k=request.top_k
    )

    return {
        "question": request.question,
        "results": results
    }


@router.post("/ask")
def rag_ask(request: RAGQuery):
    answer = generate_answer(
        request.question,
        top_k=request.top_k
    )

    return {
        "question": request.question,
        "answer": answer
    }


@router.post("/farming-advisor")
def farming_advisor_endpoint(request: FarmingAdvisorQuery):
    # Specialized prompt enforcing low-cost Israeli methodology adapted for Indian smallholders
    specialized_question = (
        f"Act as an expert Israeli Farming Advisor focusing on low-cost, "
        f"climate-adapted irrigation and fertigation for Indian smallholders. "
        f"Avoid expensive industrial automation; emphasize modular, gravity-fed, "
        f"or manual-scale systems. Location context: {request.location_context or 'General India'}. "
        f"Question: {request.question}"
    )

    answer = generate_answer(
        specialized_question,
        top_k=request.top_k
    )

    return {
        "module": "Israeli Farming Advisor",
        "question": request.question,
        "location_context": request.location_context,
        "answer": answer
    }


@router.post("/market-explainer")
def market_explainer_endpoint(request: MarketExplainerQuery):
    result = explain_market(
        crop=request.crop,
        question=request.question,
        location_context=request.location_context,
        top_k=request.top_k
    )

    return {
        "module": "Market Explainer",
        "crop": request.crop,
        "question": request.question,
        "location_context": request.location_context,
        "evidence_used": [
            doc.get("metadata", {}).get("source")
            for doc in result["context_docs"]
        ],
        "market_guidance": result["answer"]
    }