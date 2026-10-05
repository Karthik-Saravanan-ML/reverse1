from vector_store.provider import VectorStoreProvider
from embeddings.provider import EmbeddingProvider

class PermissionAwareRetriever:
    """
    CRITICAL COMPONENT: Ensures data isolation per project.
    ALWAYS filters by project_id + visibility BEFORE returning results.
    """
    
    def __init__(self, vector_store: VectorStoreProvider, embedding_provider: EmbeddingProvider, db):
        self.vector_store = vector_store
        self.embedder = embedding_provider
        self.db = db
    
    async def retrieve(
        self,
        question: str,
        project_id: str,
        user_role: str,
        allowed_visibilities: list[str]
    ) -> dict:
        """
        Main retrieval entry point.
        Returns {"document_chunks": [...], "memory_cards": [...]}
        
        FILTER BEFORE GENERATION — never retrieve unauthorized data.
        """
        if user_role in ["ADMIN", "PROJECT_MANAGER", "EMPLOYEE"]:
            allowed_visibilities = ["INTERNAL_ONLY", "PROJECT_MEMBERS", "CLIENT_SHARED"]
        else:  # CLIENT
            allowed_visibilities = ["PROJECT_MEMBERS", "CLIENT_SHARED"]

        query_embedding = self.embedder.embed_text(question)
        
        doc_chunks = await self.vector_store.similarity_search(
            query_embedding=query_embedding,
            project_id=project_id,
            allowed_visibilities=allowed_visibilities,
            limit=8
        )
        
        memory_cards = await self._retrieve_memory_cards(
            query_embedding, project_id, allowed_visibilities
        )
        
        return {"document_chunks": doc_chunks, "memory_cards": memory_cards}
    
    async def _retrieve_memory_cards(self, query_embedding, project_id, allowed_visibilities):
        """Search memory cards by keyword + similarity"""
        cards = await self.vector_store.search_memory_cards(
            query_embedding=query_embedding,
            project_id=project_id,
            allowed_visibilities=allowed_visibilities,
            limit=5
        )
        return cards
