from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from models.schemas import IngestDocumentRequest, IngestMeetingNotesRequest
from auth.jwt_validator import require_service_auth
from models.database import get_db

router = APIRouter()

@router.post("/documents/ingest")
async def ingest_document(
    request: IngestDocumentRequest,
    _: None = Depends(require_service_auth),
    db: AsyncSession = Depends(get_db)
):
    """
    Called by Spring Boot after a document is uploaded.
    1. Fetch document metadata from DB
    2. Download file from MinIO
    3. Parse → Clean → Chunk → Embed → Store
    4. Update document processing status
    """
    # Mock implementation for now, actual implementation will use MinIO, parsing, etc.
    return {"status": "success", "message": f"Document {request.document_id} ingestion started for project {request.project_id}"}

@router.post("/meeting-notes/extract")
async def extract_from_meeting_notes(
    request: IngestMeetingNotesRequest,
    _: None = Depends(require_service_auth),
    db: AsyncSession = Depends(get_db)
):
    """
    Called after meeting notes are submitted.
    Extract memory cards and call back to Spring Boot to store them.
    """
    # Mock implementation
    return {"status": "success", "message": f"Extraction started for meeting {request.meeting_id}"}
