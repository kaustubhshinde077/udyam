import time
from sentence_transformers import SentenceTransformer

from app.db.supabase import supabase


_model = None


def get_model():
    global _model

    if _model is None:
        start = time.time()
        _model = SentenceTransformer(
            "intfloat/multilingual-e5-small",
            device="cpu"
        )
        print(f"[RAG] model load: {time.time() - start:.2f}s")

    return _model


def retrieve(query, top_k=3):
    total_start = time.time()

    model = get_model()

    encode_start = time.time()
    query_embedding = model.encode(
        "query: " + query,
        normalize_embeddings=True
    ).tolist()
    print(f"[RAG] embedding: {time.time() - encode_start:.2f}s")

    db_start = time.time()
    response = supabase.rpc(
        "match_knowledge_documents",
        {
            "query_embedding": query_embedding,
            "match_count": top_k,
        }
    ).execute()
    print(f"[RAG] Supabase: {time.time() - db_start:.2f}s")

    results = []

    for row in response.data:
        results.append({
            "score": float(row["similarity"]),
            "text": row["content"],
            "metadata": {
                "business_type": row["business_type"],
                "topic": row["topic"],
                "source": row["source"],
            }
        })

    print(f"[RAG] retrieve total: {time.time() - total_start:.2f}s")

    return results