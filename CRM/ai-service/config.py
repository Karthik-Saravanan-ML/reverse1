from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SYNC_DATABASE_URL: str
    MINIO_ENDPOINT: str
    MINIO_ACCESS_KEY: str
    MINIO_SECRET_KEY: str
    MINIO_BUCKET: str
    MINIO_SECURE: bool = False
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS512"
    INTERNAL_SERVICE_KEY: str
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384
    LLM_PROVIDER: str = "ollama"
    OLLAMA_BASE_URL: str = "http://ollama:11434"
    OLLAMA_MODEL: str = "llama3.2"
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    BACKEND_URL: str = "http://backend:8080"
    CHUNK_SIZE: int = 512
    CHUNK_OVERLAP: int = 50
    MAX_RETRIEVAL_RESULTS: int = 10
    MIN_SIMILARITY_SCORE: float = 0.3
    CONFIDENCE_THRESHOLD_AUTO_APPROVE: float = 0.9
    
    class Config:
        env_file = ".env"

settings = Settings()
