import json
import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.rag.retrieve import retrieve


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
        model="gemini-3.6-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            response_mime_type="application/json",
            response_schema=RESPONSE_SCHEMA,
            temperature=0.2,
        )
    )

    return json.loads(response.text)