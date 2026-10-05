from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from api import ingestion, rag
from config import settings

app = FastAPI(title="AI-Native CRM AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.BACKEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("Starting up AI Service...")

app.include_router(ingestion.router, prefix="/api/v1")
app.include_router(rag.router, prefix="/api/v1/rag")

@app.get("/health")
async def health_check():
    return {"status": "ok"}
