import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
from models.database import Base
from config import settings

class Document(Base):
    __tablename__ = "documents"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(String, index=True)
    file_name = Column(String)
    processing_status = Column(String)
    storage_key = Column(String)
    visibility = Column(String)
    is_active = Column(Boolean, default=True)

class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"))
    project_id = Column(String, index=True)
    chunk_index = Column(Integer)
    content = Column(Text)
    embedding = Column(Vector(settings.EMBEDDING_DIMENSION))
    page_number = Column(Integer, nullable=True)
    metadata_json = Column(JSON, nullable=True)

class DocumentProcessingJob(Base):
    __tablename__ = "document_processing_jobs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"))
    status = Column(String)
    error_message = Column(Text, nullable=True)

class MemoryCard(Base):
    __tablename__ = "memory_cards"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(String, index=True)
    type = Column(String)
    title = Column(String(255))
    content = Column(Text)
    source_record_id = Column(UUID(as_uuid=True), nullable=True)
    confidence_score = Column(Float)
    review_status = Column(String)
    visibility = Column(String)
    extraction_method = Column(String)

class SourceRecord(Base):
    __tablename__ = "source_records"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(String, index=True)
    source_type = Column(String)
    source_id = Column(String)
    content = Column(Text)
    event_date = Column(DateTime)

class Meeting(Base):
    __tablename__ = "meetings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(String, index=True)
    title = Column(String)
    status = Column(String)

class MeetingNote(Base):
    __tablename__ = "meeting_notes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meeting_id = Column(UUID(as_uuid=True), ForeignKey("meetings.id"))
    agenda = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    requirements = Column(Text, nullable=True)
    decisions = Column(Text, nullable=True)
    approvals = Column(Text, nullable=True)
    questions = Column(Text, nullable=True)
    actions = Column(Text, nullable=True)
    risks = Column(Text, nullable=True)
    issues = Column(Text, nullable=True)
    follow_up = Column(Text, nullable=True)

class ProjectMembership(Base):
    __tablename__ = "project_memberships"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(String, index=True)
    user_id = Column(String, index=True)
    member_role = Column(String)
    is_active = Column(Boolean, default=True)
    is_team_lead = Column(Boolean, default=False)

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    email = Column(String, unique=True)
    role = Column(String)
    status = Column(String)
