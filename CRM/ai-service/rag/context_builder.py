class ContextBuilder:
    MAX_CONTEXT_TOKENS = 3000  # approximate
    
    def build(self, retrieved: dict, question: str) -> str:
        """
        Build LLM context from retrieved chunks and memory cards.
        Prioritize by relevance score, stay within token limit.
        """
        sections = []
        
        if retrieved["memory_cards"]:
            sections.append("=== PROJECT KNOWLEDGE BASE ===")
            for card in retrieved["memory_cards"][:5]:
                sections.append(f"[{card['type']}] {card['title']}: {card['content']}")
                
        if retrieved["document_chunks"]:
            sections.append("\n=== RELEVANT DOCUMENTS ===")
            for chunk in retrieved["document_chunks"][:6]:
                ref = f"[Document: {chunk['file_name']}, Page {chunk.get('page_number', '?')}]"
                sections.append(f"{ref}\n{chunk['content']}")
        
        if not sections:
            return "No relevant information found in the project's knowledge base."
        
        return "\n\n".join(sections)
