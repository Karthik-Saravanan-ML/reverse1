-- V8: Documents, Chunks (with pgvector), Processing Jobs

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES users(id),
    file_name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('PDF','DOCX','TXT','IMAGE','OTHER')),
    mime_type VARCHAR(100),
    file_size BIGINT NOT NULL,
    checksum VARCHAR(64) NOT NULL,  -- SHA-256 hex
    storage_key VARCHAR(500) NOT NULL,  -- MinIO object key
    visibility VARCHAR(30) NOT NULL DEFAULT 'PROJECT_MEMBERS' CHECK (visibility IN ('INTERNAL_ONLY','PROJECT_MEMBERS','CLIENT_SHARED')),
    processing_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (processing_status IN ('PENDING','PROCESSING','INDEXED','FAILED')),
    processing_error TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_documents_visibility ON documents(visibility);
CREATE INDEX idx_documents_processing_status ON documents(processing_status);
CREATE INDEX idx_documents_is_active ON documents(is_active);
CREATE INDEX idx_documents_checksum ON documents(checksum);

CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding vector(384),  -- pgvector: sentence-transformers all-MiniLM-L6-v2
    token_count INTEGER,
    page_number INTEGER,
    section_title VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX idx_document_chunks_project_id ON document_chunks(project_id);
-- HNSW index for fast approximate nearest neighbor search
CREATE INDEX idx_document_chunks_embedding ON document_chunks 
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE TABLE document_processing_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'QUEUED' CHECK (status IN ('QUEUED','PARSING','CHUNKING','EMBEDDING','DONE','FAILED')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    chunks_created INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_doc_jobs_document_id ON document_processing_jobs(document_id);
CREATE INDEX idx_doc_jobs_status ON document_processing_jobs(status);
