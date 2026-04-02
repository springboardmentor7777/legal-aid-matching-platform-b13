-- V14__new_case_workflow.sql
-- New workflow: USER submits case (OPEN), sends requests directly to lawyers/NGOs
-- No admin assignment needed

-- Update existing SUBMITTED cases to OPEN
UPDATE cases SET status = 'OPEN' WHERE status = 'SUBMITTED';

-- Update existing ACTIVE cases to ASSIGNED
UPDATE cases SET status = 'ASSIGNED' WHERE status = 'ACTIVE';

-- Add assigned_profile_id and assigned_profile_type to cases
-- so we know which lawyer/NGO owns an ASSIGNED case
ALTER TABLE cases ADD COLUMN IF NOT EXISTS assigned_profile_id   BIGINT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS assigned_profile_type VARCHAR(20);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_client_id ON cases(client_id);