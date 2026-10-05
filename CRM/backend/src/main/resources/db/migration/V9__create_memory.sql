-- V9: Source Records, Memory Cards (all 9 types), Versions, Relations

CREATE TABLE source_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    source_type VARCHAR(30) NOT NULL CHECK (source_type IN ('DOCUMENT','MEETING_NOTES','MANUAL','MESSAGE','TASK')),
    source_id UUID NOT NULL,  -- references document/meeting/message/task id
    content TEXT,             -- snapshot of source content at extraction time
    event_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_source_records_project ON source_records(project_id);
CREATE INDEX idx_source_records_source_type ON source_records(source_type);
CREATE INDEX idx_source_records_source_id ON source_records(source_id);

CREATE TABLE memory_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN (
        'REQUIREMENT','DECISION','APPROVAL','ACTION','QUESTION',
        'RISK','ISSUE','CHANGE_REQUEST','CLIENT_FEEDBACK'
    )),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    source_record_id UUID REFERENCES source_records(id),
    source_reference VARCHAR(500),   -- human-readable: "Meeting: Kickoff - 2024-01-15"
    source_type VARCHAR(30) CHECK (source_type IN ('DOCUMENT','MEETING_NOTES','MANUAL','MESSAGE','TASK')),
    event_date DATE,
    created_by_user_id UUID REFERENCES users(id),
    extraction_method VARCHAR(20) NOT NULL DEFAULT 'MANUAL' CHECK (extraction_method IN ('MANUAL','AI_EXTRACTED','FORM_SUBMITTED')),
    confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
    review_status VARCHAR(20) NOT NULL DEFAULT 'PENDING_REVIEW' CHECK (review_status IN ('PENDING_REVIEW','APPROVED','EDITED','REJECTED')),
    reviewed_by_user_id UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    visibility VARCHAR(30) NOT NULL DEFAULT 'PROJECT_MEMBERS' CHECK (visibility IN ('INTERNAL_ONLY','PROJECT_MEMBERS','CLIENT_SHARED')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_memory_cards_project_id ON memory_cards(project_id);
CREATE INDEX idx_memory_cards_type ON memory_cards(type);
CREATE INDEX idx_memory_cards_review_status ON memory_cards(review_status);
CREATE INDEX idx_memory_cards_visibility ON memory_cards(visibility);
CREATE INDEX idx_memory_cards_is_active ON memory_cards(is_active);
CREATE INDEX idx_memory_cards_source_record ON memory_cards(source_record_id);

CREATE TABLE memory_card_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    memory_card_id UUID NOT NULL REFERENCES memory_cards(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    edited_by_user_id UUID REFERENCES users(id),
    edit_reason TEXT,
    edited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mcv_card_id ON memory_card_versions(memory_card_id);

CREATE TABLE memory_card_relations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_card_id UUID NOT NULL REFERENCES memory_cards(id) ON DELETE CASCADE,
    target_card_id UUID NOT NULL REFERENCES memory_cards(id) ON DELETE CASCADE,
    relationship_type VARCHAR(30) NOT NULL CHECK (relationship_type IN ('LEADS_TO','CONTRADICTS','RESOLVES','IMPLEMENTS','RELATED_TO','SUPERSEDES')),
    created_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(source_card_id, target_card_id, relationship_type)
);

CREATE INDEX idx_mcr_source ON memory_card_relations(source_card_id);
CREATE INDEX idx_mcr_target ON memory_card_relations(target_card_id);

-- Now add the FK for meeting_outcomes.memory_card_id
ALTER TABLE meeting_outcomes 
    ADD CONSTRAINT fk_meeting_outcomes_memory_card 
    FOREIGN KEY (memory_card_id) REFERENCES memory_cards(id);
