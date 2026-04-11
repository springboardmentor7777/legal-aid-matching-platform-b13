-- Add structured columns to cases table
ALTER TABLE cases ADD COLUMN IF NOT EXISTS case_type VARCHAR(255);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS urgency VARCHAR(50) DEFAULT 'MEDIUM';
ALTER TABLE cases ADD COLUMN IF NOT EXISTS location VARCHAR(255);

-- Populate case_type from existing title data
UPDATE cases
SET case_type = COALESCE(title, 'Other')
WHERE case_type IS NULL;

ALTER TABLE cases
ALTER COLUMN case_type SET NOT NULL;

-- Add status constraint
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'case_status_check'
    ) THEN
        ALTER TABLE cases
        ADD CONSTRAINT case_status_check
        CHECK (status IN ('OPEN','IN_PROGRESS','CLOSED'));
    END IF;
END $$;

-- Add urgency constraint
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'urgency_check'
    ) THEN
        ALTER TABLE cases
        ADD CONSTRAINT urgency_check
        CHECK (urgency IN ('LOW','MEDIUM','HIGH'));
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_cases_user_id ON cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_cases_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_cases_timestamp ON cases;

CREATE TRIGGER update_cases_timestamp
BEFORE UPDATE ON cases
FOR EACH ROW
EXECUTE FUNCTION update_cases_timestamp();