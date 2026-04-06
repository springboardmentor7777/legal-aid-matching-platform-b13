-- =============================================
-- V25: Onboarding, Jurisdiction & Case Refinements
-- =============================================

-- 1. Users table: add onboarding_complete flag
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE;

-- Set all existing users as onboarding complete (they were created before wizard existed)
UPDATE users SET onboarding_complete = TRUE WHERE onboarding_complete IS NULL OR onboarding_complete = FALSE;

-- 2. Lawyer profiles: add onboarding fields
ALTER TABLE lawyer_profiles ADD COLUMN IF NOT EXISTS state VARCHAR(150);
ALTER TABLE lawyer_profiles ADD COLUMN IF NOT EXISTS city VARCHAR(150);
ALTER TABLE lawyer_profiles ADD COLUMN IF NOT EXISTS practice_areas TEXT;
ALTER TABLE lawyer_profiles ADD COLUMN IF NOT EXISTS office_address TEXT;
ALTER TABLE lawyer_profiles ADD COLUMN IF NOT EXISTS bar_council_license VARCHAR(100);
ALTER TABLE lawyer_profiles ADD COLUMN IF NOT EXISTS license_document_name VARCHAR(255);

-- 3. NGO profiles: add onboarding fields
ALTER TABLE ngo_profiles ADD COLUMN IF NOT EXISTS state VARCHAR(150);
ALTER TABLE ngo_profiles ADD COLUMN IF NOT EXISTS city VARCHAR(150);
ALTER TABLE ngo_profiles ADD COLUMN IF NOT EXISTS focus_areas TEXT;
ALTER TABLE ngo_profiles ADD COLUMN IF NOT EXISTS office_address TEXT;
ALTER TABLE ngo_profiles ADD COLUMN IF NOT EXISTS ngo_darpan_id VARCHAR(100);
ALTER TABLE ngo_profiles ADD COLUMN IF NOT EXISTS registration_cert_name VARCHAR(255);

-- 4. Cases table: add new fields
ALTER TABLE cases ADD COLUMN IF NOT EXISTS incident_date DATE;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS has_previous_legal_action BOOLEAN DEFAULT FALSE;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS previous_legal_action_details TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(100);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS what_happened TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS opposing_party_name VARCHAR(255);

-- 5. Jurisdiction reference table
CREATE TABLE IF NOT EXISTS jurisdictions (
    id BIGSERIAL PRIMARY KEY,
    state VARCHAR(150) NOT NULL,
    court_name VARCHAR(255) NOT NULL
);

-- 6. Seed jurisdiction data (Indian Courts)
INSERT INTO jurisdictions (state, court_name) VALUES
-- Delhi
('Delhi', 'Supreme Court of India'),
('Delhi', 'Delhi High Court'),
('Delhi', 'Patiala House Court'),
('Delhi', 'Tis Hazari Court'),
('Delhi', 'Saket Court'),
-- Maharashtra
('Maharashtra', 'Bombay High Court'),
('Maharashtra', 'City Civil Court Mumbai'),
('Maharashtra', 'Sessions Court Pune'),
('Maharashtra', 'Nagpur Bench'),
-- Karnataka
('Karnataka', 'Karnataka High Court'),
('Karnataka', 'City Civil Court Bangalore'),
('Karnataka', 'Sessions Court Mangalore'),
-- Tamil Nadu
('Tamil Nadu', 'Madras High Court'),
('Tamil Nadu', 'City Civil Court Chennai'),
('Tamil Nadu', 'Madurai Bench'),
-- Uttar Pradesh
('Uttar Pradesh', 'Allahabad High Court'),
('Uttar Pradesh', 'Lucknow Bench'),
('Uttar Pradesh', 'District Court Noida'),
-- West Bengal
('West Bengal', 'Calcutta High Court'),
('West Bengal', 'City Civil Court Kolkata'),
-- Telangana
('Telangana', 'Telangana High Court'),
('Telangana', 'City Civil Court Hyderabad'),
-- Gujarat
('Gujarat', 'Gujarat High Court'),
('Gujarat', 'City Civil Court Ahmedabad'),
-- Rajasthan
('Rajasthan', 'Rajasthan High Court (Jodhpur)'),
('Rajasthan', 'Jaipur Bench'),
-- Kerala
('Kerala', 'Kerala High Court'),
('Kerala', 'District Court Ernakulam'),
-- Punjab
('Punjab', 'Punjab & Haryana High Court'),
('Punjab', 'District Court Ludhiana'),
-- Madhya Pradesh
('Madhya Pradesh', 'Madhya Pradesh High Court (Jabalpur)'),
('Madhya Pradesh', 'Indore Bench'),
('Madhya Pradesh', 'Gwalior Bench');
