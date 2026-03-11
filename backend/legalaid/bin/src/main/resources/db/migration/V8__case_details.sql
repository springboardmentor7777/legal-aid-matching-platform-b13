-- Add new fields to cases table for detailed case submission

ALTER TABLE cases
    ADD COLUMN IF NOT EXISTS keywords VARCHAR(500),
    ADD COLUMN IF NOT EXISTS date_time TIMESTAMP,
    ADD COLUMN IF NOT EXISTS contact_info VARCHAR(255),
    ADD COLUMN IF NOT EXISTS other_party_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS other_party_location VARCHAR(255),
    ADD COLUMN IF NOT EXISTS other_party_contact VARCHAR(255),
    ADD COLUMN IF NOT EXISTS other_party_representative VARCHAR(255),
    ADD COLUMN IF NOT EXISTS investigating_officer VARCHAR(255),
    ADD COLUMN IF NOT EXISTS witnesses TEXT,
    ADD COLUMN IF NOT EXISTS current_status VARCHAR(100),
    ADD COLUMN IF NOT EXISTS fir_number VARCHAR(100),
    ADD COLUMN IF NOT EXISTS fir_document TEXT,
    ADD COLUMN IF NOT EXISTS fir_document_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS case_documents TEXT,
    ADD COLUMN IF NOT EXISTS case_document_names TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cases_category ON cases(category);
CREATE INDEX IF NOT EXISTS idx_cases_current_status ON cases(current_status);