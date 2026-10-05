from abc import ABC, abstractmethod

class VectorStoreProvider(ABC):
    @abstractmethod
    async def store_chunks(self, chunks: list[dict], embeddings: list[list[float]]) -> None: ...

    @abstractmethod
    async def similarity_search(self, query_embedding: list[float], project_id: str, allowed_visibilities: list[str], limit: int = 10, min_score: float = 0.3) -> list[dict]: ...

    @abstractmethod
    async def delete_document_chunks(self, document_id: str) -> None: ...

    @abstractmethod
    async def search_memory_cards(self, query_embedding: list[float], project_id: str, allowed_visibilities: list[str], limit: int = 5) -> list[dict]: ...
