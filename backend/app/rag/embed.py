import json
from pathlib import Path
from sentence_transformers import SentenceTransformer


# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
INPUT_FILE = BASE_DIR / "data" / "processed_knowledge.json"
OUTPUT_FILE = BASE_DIR / "data" / "embedded_knowledge.json"


# Load embedding model
model = SentenceTransformer("intfloat/multilingual-e5-small")


# Load processed knowledge
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    chunks = json.load(f)


# Create embeddings
for chunk in chunks:
    text = "passage: " + chunk["text"]
    chunk["embedding"] = model.encode(text).tolist()


# Save
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(chunks, f, ensure_ascii=False, indent=2)


print(f"Embedded {len(chunks)} knowledge chunks.")
print(f"Saved to: {OUTPUT_FILE}")