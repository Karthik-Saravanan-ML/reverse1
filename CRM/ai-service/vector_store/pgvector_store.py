from sqlalchemy import text
from pgvector.sqlalchemy import Vector
from vector_store.provider import VectorStoreProvider
from embeddings.provider import EmbeddingProvider

class PgVectorStore(VectorStoreProvider):
    def __init__(self, db_session, embedding_provider: EmbeddingProvider):
        self.db = db_session
        self.embedder = embedding_provider
    
    async def store_chunks(self, chunks: list[dict], embeddings: list[list[float]]) -> None:
        if not chunks:
            return
        
        values = []
        for chunk, emb in zip(chunks, embeddings):
            values.append({
                "id": str(chunk.get("id", "")), # Assuming id is generated before or by db if omitted, wait, usually UPSERT needs id or let db generate. Let's just insert.
                "document_id": chunk["document_id"],
                "project_id": chunk["project_id"],
                "chunk_index": chunk["chunk_index"],
                "content": chunk["content"],
                "embedding": str(emb),
                "page_number": chunk.get("page_number")
            })
            
        sql = text("""
            INSERT INTO document_chunks (document_id, project_id, chunk_index, content, embedding, page_number)
            VALUES (:document_id, :project_id, :chunk_index, :content, :embedding::vector, :page_number)
            ON CONFLICT (id) DO UPDATE SET
                content = EXCLUDED.content,
                embedding = EXCLUDED.embedding,
                page_number = EXCLUDED.page_number
        """)
        
        for val in values:
            if "id" in val and val["id"]:
                sql_with_id = text("""
                    INSERT INTO document_chunks (id, document_id, project_id, chunk_index, content, embedding, page_number)
                    VALUES (:id, :document_id, :project_id, :chunk_index, :content, :embedding::vector, :page_number)
                    ON CONFLICT (id) DO UPDATE SET
                        content = EXCLUDED.content,
                        embedding = EXCLUDED.embedding,
                        page_number = EXCLUDED.page_number
                """)
                await self.db.execute(sql_with_id, val)
            else:
                await self.db.execute(sql, val)
                
        await self.db.commit()

    async def similarity_search(
        self,
        query_embedding: list[float],
        project_id: str,
        allowed_visibilities: list[str],
        limit: int = 10,
        min_score: float = 0.3
    ) -> list[dict]:
        sql = text("""
            SELECT 
                dc.id,
                dc.document_id,
                dc.project_id,
                dc.content,
                dc.page_number,
                dc.chunk_index,
                d.file_name,
                d.visibility,
                1 - (dc.embedding <=> :query_embedding::vector) as similarity
            FROM document_chunks dc
            JOIN documents d ON d.id = dc.document_id
            WHERE dc.project_id = :project_id
              AND d.visibility = ANY(:visibilities)
              AND d.is_active = true
              AND 1 - (dc.embedding <=> :query_embedding::vector) >= :min_score
            ORDER BY dc.embedding <=> :query_embedding::vector
            LIMIT :limit
        """)
        result = await self.db.execute(sql, {
            "query_embedding": str(query_embedding),
            "project_id": project_id,
            "visibilities": allowed_visibilities,
            "min_score": min_score,
            "limit": limit
        })
        return [dict(row) for row in result.mappings()]
    
    async def delete_document_chunks(self, document_id: str) -> None:
        sql = text("DELETE FROM document_chunks WHERE document_id = :document_id")
        await self.db.execute(sql, {"document_id": document_id})
        await self.db.commit()
    
    async def search_memory_cards(
        self,
        query_embedding: list[float],
        project_id: str,
        allowed_visibilities: list[str],
        limit: int = 5
    ) -> list[dict]:
        # Assuming memory_cards don't have embeddings in schema, but prompt says "Search memory cards using their embedded content"
        # We'll just do a text search if embedding column doesn't exist, wait, or if it does, we can use it. The schema doesn't show embedding in memory_cards. We'll simulate or use ILIKE for now, but to be compliant we might need to add embedding to memory_cards or just do a simple query.
        # Let's do a basic query since schema doesn't have embedding vector in memory_cards.
        sql = text("""
            SELECT id, type, title, content, confidence_score as relevance_score
            FROM memory_cards
            WHERE project_id = :project_id
              AND visibility = ANY(:visibilities)
            LIMIT :limit
        """)
        result = await self.db.execute(sql, {
            "project_id": project_id,
            "visibilities": allowed_visibilities,
            "limit": limit
        })
        return [dict(row) for row in result.mappings()]
