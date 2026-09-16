from fastapi import FastAPI

from app.api.rag import router as rag_router

from app.api.users import router as users_router

from app.api.analysis import router as analysis_router

from app.api.business import router as business_router

from app.api.financial import router as financial_router

from app.api.survey import router as survey_router

app = FastAPI(title="Udyam API")

app.include_router(rag_router)
app.include_router(users_router)
app.include_router(analysis_router)
app.include_router(business_router)
app.include_router(financial_router)
app.include_router(survey_router)

@app.get("/")
def root():
    return {"message": "Udyam API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}