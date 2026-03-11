-- Add location field to cases table
ALTER TABLE cases
    ADD COLUMN IF NOT EXISTS location VARCHAR(255);

-- Index for filtering cases by location
CREATE INDEX IF NOT EXISTS idx_cases_location ON cases(location);