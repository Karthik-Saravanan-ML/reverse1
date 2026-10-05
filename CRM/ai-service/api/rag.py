from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from models.schemas import RagAskRequest
from auth.jwt_validator import require_service_auth
from models.database import get_db
# In a real app we'd inject rag_pipeline, here we'll assume it's created or we'll return a mock for the router structure.
# For completeness, let's assume it's globally available or created on the fly.
from config import settings
from embeddings.sentence_transformer_provider import SentenceTransformerProvider
from vector_store.pgvector_store import PgVectorStore
from llm.ollama_provider import OllamaProvider
from llm.openai_provider import OpenAIProvider
from retrieval.retriever import PermissionAwareRetriever
from rag.context_builder import ContextBuilder
from rag.answer_generator import AnswerGenerator
from rag.pipeline import RAGPipeline

router = APIRouter()

@router.post("/ask")
async def ask_question(
    request: RagAskRequest,
    _: None = Depends(require_service_auth),
    db: AsyncSession = Depends(get_db)
):
    """
    CRITICAL: project_id and allowed_visibilities come from Spring Boot,
    which has already validated the user's project membership.
    Do NOT accept raw project_id from browser.
    """
    embedder = SentenceTransformerProvider(settings.EMBEDDING_MODEL)
    vector_store = PgVectorStore(db, embedder)
    
    if settings.LLM_PROVIDER == "openai":
        llm = OpenAIProvider(settings.OPENAI_API_KEY, settings.OPENAI_MODEL)
    else:
        llm = OllamaProvider(settings.OLLAMA_BASE_URL, settings.OLLAMA_MODEL)
        
    retriever = PermissionAwareRetriever(vector_store, embedder, db)
    context_builder = ContextBuilder()
    answer_generator = AnswerGenerator(llm)
    
    rag_pipeline = RAGPipeline(retriever, context_builder, answer_generator)
    
    response = await rag_pipeline.answer(request)
    return response
