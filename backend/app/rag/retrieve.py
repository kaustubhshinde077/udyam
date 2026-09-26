from sentence_transformers import SentenceTransformer

from app.db.supabase import supabase


_model = None


def get_model():
    global _model

    if _model is None:
        _model = SentenceTransformer(
            "intfloat/multilingual-e5-small",
            device="cpu"
        )

    return _model


def retrieve(query, top_k=3):
    model = get_model()

    query_embedding = model.encode(
        "query: " + query,
        normalize_embeddings=True
    ).tolist()

    response = supabase.rpc(
        "match_knowledge_documents",
        {
            "query_embedding": query_embedding,
            "match_count": top_k,
        }
    ).execute()

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

    return results