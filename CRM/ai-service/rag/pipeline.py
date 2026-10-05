import time
from models.schemas import RagAskRequest, RagAskResponse
from retrieval.retriever import PermissionAwareRetriever
from rag.context_builder import ContextBuilder
from rag.answer_generator import AnswerGenerator

class RAGPipeline:
    def __init__(self, retriever: PermissionAwareRetriever, context_builder: ContextBuilder, answer_generator: AnswerGenerator):
        self.retriever = retriever
        self.context_builder = context_builder
        self.answer_generator = answer_generator
    
    async def answer(self, request: RagAskRequest) -> RagAskResponse:
        """
        Full RAG pipeline:
        1. Authenticate/authorize (done before this call)
        2. Retrieve relevant chunks (permission-filtered)
        3. Build context
        4. Generate answer
        5. Map sources
        6. Return answer with citations
        """
        start_time = time.time()
        
        retrieved = await self.retriever.retrieve(
            question=request.question,
            project_id=request.project_id,
            user_role=request.user_role,
            allowed_visibilities=request.allowed_visibilities
        )
        
        context = self.context_builder.build(retrieved, request.question)
        
        answer_text, sources = await self.answer_generator.generate(
            question=request.question,
            context=context,
            retrieved_chunks=retrieved["document_chunks"],
            memory_cards=retrieved["memory_cards"]
        )
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return RagAskResponse(
            answer=answer_text,
            sources=sources,
            confidence=self._compute_confidence(retrieved, sources),
            processing_time_ms=processing_time
        )
    
    def _compute_confidence(self, retrieved, sources):
        if not sources:
            return 0.0
        avg_score = sum(s.relevance_score for s in sources) / len(sources)
        return min(1.0, avg_score * 1.2)
