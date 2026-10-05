import json
from llm.provider import LLMProvider

class MemoryExtractor:
    """
    Extracts structured Memory Cards from unstructured text using LLM.
    Used after meeting notes submission or document processing.
    """
    
    EXTRACTION_SYSTEM_PROMPT = """You are a precise knowledge extraction system for a project management platform.
    Extract structured memory cards from the provided text.
    
    Memory Card Types:
    - REQUIREMENT: Functional or non-functional requirements
    - DECISION: Technical or business decisions made
    - APPROVAL: Items that were formally approved
    - ACTION: Action items assigned to specific people
    - QUESTION: Open questions that need answers
    - RISK: Identified risks to the project
    - ISSUE: Problems or blockers encountered
    - CHANGE_REQUEST: Requests to change existing scope/requirements
    - CLIENT_FEEDBACK: Feedback provided by the client
    
    Rules:
    - Only extract information explicitly stated in the text
    - Do NOT infer or assume information not present
    - Each card must be self-contained and clear
    - Assign a confidence score (0.0-1.0) based on clarity
    - For DECISION, APPROVAL, CHANGE_REQUEST: confidence >= 0.8 recommended
    
    Return JSON array of memory cards.
    """

    def __init__(self, llm: LLMProvider):
        self.llm = llm
    
    async def extract_from_text(
        self,
        text: str,
        source_type: str,
        project_id: str,
        context: dict = None
    ) -> list[dict]:
        """
        Returns list of memory card dicts:
        {type, title, content, confidence_score, reasoning}
        """
        prompt = f"""Extract memory cards from this {source_type} text:

---
{text}
---

Return a JSON array. Each item: {{"type": "REQUIREMENT", "title": "short title", "content": "full content", "confidence_score": 0.85, "reasoning": "why this type"}}

Important: 
- Return ONLY the JSON array, no other text
- If nothing extractable, return []
- Maximum 20 cards per extraction
"""
        response = await self.llm.generate(
            system_prompt=self.EXTRACTION_SYSTEM_PROMPT,
            user_message=prompt,
            temperature=0.1
        )
        
        try:
            if "```json" in response:
                response = response.split("```json")[1].split("```")[0]
            elif "```" in response:
                response = response.split("```")[1].split("```")[0]
            cards = json.loads(response.strip())
            return [self._validate_card(c) for c in cards if self._validate_card(c)]
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {e}")
            return []
    
    def _validate_card(self, card: dict) -> dict | None:
        """Validates and normalizes extracted card"""
        required_fields = ["type", "title", "content"]
        if not all(f in card for f in required_fields):
            return None
        
        valid_types = ["REQUIREMENT", "DECISION", "APPROVAL", "ACTION", "QUESTION", "RISK", "ISSUE", "CHANGE_REQUEST", "CLIENT_FEEDBACK"]
        if card.get("type") not in valid_types:
            return None
        
        return {
            "type": card["type"],
            "title": card["title"][:255],  # truncate to DB limit
            "content": card["content"],
            "confidence_score": min(1.0, max(0.0, float(card.get("confidence_score", 0.7)))),
            "reasoning": card.get("reasoning", "")
        }
    
    async def extract_from_meeting_notes(self, meeting_notes: dict, project_id: str) -> list[dict]:
        """Extract from structured meeting notes sections"""
        text = json.dumps(meeting_notes)
        return await self.extract_from_text(text, "meeting_notes", project_id)
