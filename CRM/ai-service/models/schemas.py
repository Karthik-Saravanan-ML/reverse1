from typing import List, Optional
from pydantic import BaseModel, Field
import uuid

class IngestDocumentRequest(BaseModel):
    document_id: str
    project_id: str

class IngestMeetingNotesRequest(BaseModel):
    meeting_id: str
    project_id: str

class RagAskRequest(BaseModel):
    question: str
    project_id: str
    user_id: str
    user_role: str
    allowed_visibilities: List[str]

class SourceReference(BaseModel):
    type: str
    id: str
    title: str
    reference: str
    snippet: str
    relevance_score: float

class RagAskResponse(BaseModel):
    answer: str
    sources: List[SourceReference]
    confidence: float
    processing_time_ms: int

class MemoryCardDraft(BaseModel):
    type: str
    title: str
    content: str
    confidence_score: float
    reasoning: str

class ExtractedMemoryCards(BaseModel):
    cards: List[MemoryCardDraft]

class MemoryCardCreateRequest(BaseModel):
    project_id: str
    type: str
    title: str
    content: str
    source_record_id: Optional[str] = None
    confidence_score: float
    review_status: str
    visibility: str
    extraction_method: str

class ExtractMemoryFromTextRequest(BaseModel):
    text: str
    source_type: str
    source_id: str
    project_id: str
