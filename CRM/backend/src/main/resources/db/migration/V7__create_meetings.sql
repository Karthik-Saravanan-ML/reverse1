-- V7: Meetings, Participants, Notes, Outcomes

CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    organizer_user_id UUID REFERENCES users(id),
    project_manager_id UUID REFERENCES users(id),  -- optional PM attendance
    scheduled_start_at TIMESTAMPTZ NOT NULL,
    scheduled_end_at TIMESTAMPTZ NOT NULL,
    actual_start_at TIMESTAMPTZ,
    actual_end_at TIMESTAMPTZ,
    meeting_type VARCHAR(30) NOT NULL DEFAULT 'CLIENT' CHECK (meeting_type IN ('INTERNAL','CLIENT','REVIEW','STANDUP','PLANNING')),
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED','IN_PROGRESS','COMPLETED','CANCELLED')),
    meeting_link VARCHAR(500),
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_meetings_project_id ON meetings(project_id);
CREATE INDEX idx_meetings_scheduled_start ON meetings(scheduled_start_at);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meetings_organizer ON meetings(organizer_user_id);

CREATE TABLE meeting_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    participant_type VARCHAR(20) NOT NULL DEFAULT 'REQUIRED' CHECK (participant_type IN ('ORGANIZER','REQUIRED','OPTIONAL')),
    rsvp_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (rsvp_status IN ('PENDING','ACCEPTED','DECLINED','TENTATIVE')),
    attended_at TIMESTAMPTZ,
    left_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(meeting_id, user_id)
);

CREATE INDEX idx_meeting_participants_meeting ON meeting_participants(meeting_id);
CREATE INDEX idx_meeting_participants_user ON meeting_participants(user_id);

CREATE TABLE meeting_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID NOT NULL UNIQUE REFERENCES meetings(id) ON DELETE CASCADE,
    agenda TEXT,
    summary TEXT,
    requirements TEXT,
    decisions TEXT,
    approvals TEXT,
    questions TEXT,
    actions TEXT,
    risks TEXT,
    issues TEXT,
    follow_up TEXT,
    recorded_by UUID REFERENCES users(id),
    submitted_for_memory BOOLEAN NOT NULL DEFAULT FALSE,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE meeting_outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    notes_id UUID REFERENCES meeting_notes(id),
    outcome_type VARCHAR(50) NOT NULL CHECK (outcome_type IN ('REQUIREMENT','DECISION','APPROVAL','ACTION','QUESTION','RISK','ISSUE','CHANGE_REQUEST','CLIENT_FEEDBACK')),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    submitted_to_memory BOOLEAN NOT NULL DEFAULT FALSE,
    memory_card_id UUID,  -- FK to memory_cards, set after extraction (circular, added post-V9)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_meeting_outcomes_meeting ON meeting_outcomes(meeting_id);
CREATE INDEX idx_meeting_outcomes_type ON meeting_outcomes(outcome_type);
