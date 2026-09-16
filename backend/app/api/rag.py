from fastapi import APIRouter
from pydantic import BaseModel

from app.rag.retrieve import retrieve
from app.rag.generate import generate_answer


router = APIRouter(prefix="/rag", tags=["RAG"])


class RAGQuery(BaseModel):
    question: str
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