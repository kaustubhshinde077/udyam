from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.rag import router as rag_router
from app.api.users import router as users_router
from app.api.analysis import router as analysis_router
from app.api.business import router as business_router
from app.api.financial import router as financial_router
from app.api.survey import router as survey_router
from app.api.locations import router as locations_router

app = FastAPI(title="Udyam API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://udyam-1-51l1.onrender.com/"
        "https://ubiquitous-system-69p7vjv95g6v24gv7-3000.app.github.dev",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rag_router)
app.include_router(users_router)
app.include_router(analysis_router)
app.include_router(business_router)
app.include_router(financial_router)
app.include_router(survey_router)
app.include_router(locations_router)

@app.get("/")
def root():
    return {"message": "Udyam API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}