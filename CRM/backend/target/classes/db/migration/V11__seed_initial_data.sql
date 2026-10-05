-- V11: Seed Initial Data
-- Default admin user (password: Change@Admin123! - bcrypt hashed)
-- BCrypt hash for 'Change@Admin123!' with strength 12

INSERT INTO users (
    id, email, password_hash, first_name, last_name, phone,
    role, status, email_verified, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@crm.local',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCXDGqHJMDuV.K7oOgBNvVu',
    'System',
    'Administrator',
    NULL,
    'ADMIN',
    'ACTIVE',
    TRUE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Seed roles reference (informational - actual roles are in users.role column)
-- These are just for display/reference
INSERT INTO organizations (id, name, industry, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'Internal',
    'Software',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;
