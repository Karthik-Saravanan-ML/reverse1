from llm.provider import LLMProvider
from models.schemas import SourceReference

class AnswerGenerator:
    SYSTEM_PROMPT = """You are an intelligent assistant for a project management platform.
    You answer questions about projects based ONLY on the provided context.
    
    Rules:
    1. Answer ONLY from the provided context. Do NOT use external knowledge.
    2. If the context doesn't contain sufficient information, say so clearly.
    3. Always cite your sources using [Source: ...] notation.
    4. Distinguish between approved facts and uncertain information.
    5. If information conflicts, note the conflict.
    6. Do NOT hallucinate or make up information.
    7. Keep answers concise and professional.
    """
    
    def __init__(self, llm: LLMProvider):
        self.llm = llm

    async def generate(
        self,
        question: str,
        context: str,
        retrieved_chunks: list[dict],
        memory_cards: list[dict]
    ) -> tuple[str, list]:
        """Returns (answer_text, source_references)"""
        
        user_message = f"""Context:
{context}

Question: {question}

Please answer based on the context above. If the context doesn't contain enough information, say "Based on available project information, I cannot fully answer this question" and explain what's missing."""
        
        answer_text = await self.llm.generate(
            system_prompt=self.SYSTEM_PROMPT,
            user_message=user_message,
            temperature=0.1
        )
        
        sources = self._build_sources(retrieved_chunks, memory_cards)
        
        return answer_text, sources
    
    def _build_sources(self, chunks, cards) -> list:
        sources = []
        for chunk in chunks[:5]:
            sources.append(SourceReference(
                type="document",
                id=str(chunk["document_id"]),
                title=chunk["file_name"],
                reference=f"Page {chunk.get('page_number', '?')}",
                snippet=chunk["content"][:200] + "...",
                relevance_score=float(chunk.get("similarity", 0))
            ))
        for card in cards[:3]:
            sources.append(SourceReference(
                type="memory_card",
                id=str(card["id"]),
                title=card["title"],
                reference=f"{card['type']} Card",
                snippet=card["content"][:200] + "...",
                relevance_score=float(card.get("relevance_score", 0.7))
            ))
        return sources
