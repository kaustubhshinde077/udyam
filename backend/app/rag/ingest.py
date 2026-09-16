import json
from pathlib import Path

from sentence_transformers import SentenceTransformer

from app.db.supabase import supabase


BASE_DIR = Path(__file__).resolve().parents[2]
KNOWLEDGE_DIR = BASE_DIR / "knowledge"

model = SentenceTransformer(
    "intfloat/multilingual-e5-small",
    device="cpu"
)


def create_chunks(data, source_name):
    chunks = []
    business_type = data.get("business_type", "unknown")

    for section, value in data.items():

        if section in [
            "business_type",
            "scope",
            "source_notes",
            "version",
            "evidence_policy",
            "last_reviewed",
        ]:
            continue

        if isinstance(value, list):

            for item in value:
                if isinstance(item, dict):
                    text = " ".join(
                        str(v)
                        for v in item.values()
                        if isinstance(v, (str, int, float))
                    )
                else:
                    text = str(item)

                if text.strip():
                    chunks.append({
                        "business_type": business_type,
                        "topic": section,
                        "content": text,
                        "source": source_name,
                    })

        elif isinstance(value, dict):

            for subtopic, subvalue in value.items():

                if isinstance(subvalue, list):
                    for item in subvalue:

                        if isinstance(item, dict):
                            text = " ".join(
                                str(v)
                                for v in item.values()
                                if isinstance(v, (str, int, float))
                            )
                        else:
                            text = str(item)

                        if text.strip():
                            chunks.append({
                                "business_type": business_type,
                                "topic": f"{section}.{subtopic}",
                                "content": text,
                                "source": source_name,
                            })

    return chunks


def ingest():
    files = sorted(KNOWLEDGE_DIR.glob("*.json"))

    if not files:
        raise FileNotFoundError(
            f"No knowledge files found in {KNOWLEDGE_DIR}"
        )

    total = 0

    for path in files:

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        chunks = create_chunks(data, path.name)

        print(f"{path.name}: {len(chunks)} chunks")

        for chunk in chunks:

            embedding = model.encode(
                "passage: " + chunk["content"],
                normalize_embeddings=True
            ).tolist()

            supabase.table("knowledge_documents").insert({
                "business_type": chunk["business_type"],
                "topic": chunk["topic"],
                "content": chunk["content"],
                "source": chunk["source"],
                "embedding": embedding,
            }).execute()

            total += 1

    print(f"\nInserted {total} knowledge chunks into Supabase.")


if __name__ == "__main__":
    ingest()