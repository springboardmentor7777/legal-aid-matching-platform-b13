-- ===============================
-- V24: Upgrade cases table to industry-ready standard
-- Adds: Parties, Jurisdiction, Financial Eligibility, Evidence, Narrative fields
-- ===============================

-- ── Parties Involved ──
ALTER TABLE cases ADD COLUMN IF NOT EXISTS petitioner_name VARCHAR(255);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS petitioner_contact VARCHAR(100);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS petitioner_address TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS respondent_name VARCHAR(255);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS respondent_contact VARCHAR(100);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS respondent_address TEXT;

-- ── Jurisdiction & Court ──
ALTER TABLE cases ADD COLUMN IF NOT EXISTS jurisdiction_city VARCHAR(150);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS jurisdiction_state VARCHAR(150);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS court_name VARCHAR(255);

-- ── Financial Eligibility (Pro Bono) ──
ALTER TABLE cases ADD COLUMN IF NOT EXISTS financial_eligibility BOOLEAN DEFAULT FALSE;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS annual_income DECIMAL(12,2);

-- ── Evidence & Documentation ──
ALTER TABLE cases ADD COLUMN IF NOT EXISTS fir_number VARCHAR(100);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS fir_date DATE;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS police_station VARCHAR(255);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS evidence_summary TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS documents_description TEXT;

-- ── Narrative ──
ALTER TABLE cases ADD COLUMN IF NOT EXISTS chronology_of_events TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS relief_sought TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS previous_legal_action TEXT;

-- ── Indexes for new fields ──
CREATE INDEX IF NOT EXISTS idx_cases_jurisdiction ON cases(jurisdiction_city);
CREATE INDEX IF NOT EXISTS idx_cases_case_type ON cases(case_type);
CREATE INDEX IF NOT EXISTS idx_cases_financial ON cases(financial_eligibility);
