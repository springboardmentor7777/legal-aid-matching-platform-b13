-- Users table: add onboarding flag
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE;

UPDATE users SET onboarding_complete = TRUE WHERE onboarding_complete IS NULL OR onboarding_complete = FALSE;

-- Lawyer profiles: onboarding fields
ALTER TABLE lawyer_profiles ADD COLUMN IF NOT EXISTS state VARCHAR(150);
ALTER TABLE lawyer_profiles ADD COLUMN IF NOT EXISTS city VARCHAR(150);
ALTER TABLE lawyer_profiles ADD COLUMN IF NOT EXISTS practice_areas TEXT;
ALTER TABLE lawyer_profiles ADD COLUMN IF NOT EXISTS office_address TEXT;
ALTER TABLE lawyer_profiles ADD COLUMN IF NOT EXISTS bar_council_license VARCHAR(100);
ALTER TABLE lawyer_profiles ADD COLUMN IF NOT EXISTS license_document_name VARCHAR(255);

-- NGO profiles: onboarding fields
ALTER TABLE ngo_profiles ADD COLUMN IF NOT EXISTS state VARCHAR(150);
ALTER TABLE ngo_profiles ADD COLUMN IF NOT EXISTS city VARCHAR(150);
ALTER TABLE ngo_profiles ADD COLUMN IF NOT EXISTS focus_areas TEXT;
ALTER TABLE ngo_profiles ADD COLUMN IF NOT EXISTS office_address TEXT;
ALTER TABLE ngo_profiles ADD COLUMN IF NOT EXISTS ngo_darpan_id VARCHAR(100);
ALTER TABLE ngo_profiles ADD COLUMN IF NOT EXISTS registration_cert_name VARCHAR(255);

-- Cases table: additional fields
ALTER TABLE cases ADD COLUMN IF NOT EXISTS incident_date DATE;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS has_previous_legal_action BOOLEAN DEFAULT FALSE;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS previous_legal_action_details TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(100);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS what_happened TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS opposing_party_name VARCHAR(255);

-- Jurisdiction reference table
CREATE TABLE IF NOT EXISTS jurisdictions (
    id BIGSERIAL PRIMARY KEY,
    state VARCHAR(150) NOT NULL,
    court_name VARCHAR(255) NOT NULL
);

-- Seed jurisdiction data (Indian courts)
INSERT INTO jurisdictions (state, court_name) VALUES
('Delhi', 'Supreme Court of India'),
('Delhi', 'Delhi High Court'),
('Delhi', 'Patiala House Court'),
('Delhi', 'Tis Hazari Court'),
('Delhi', 'Saket Court'),
('Maharashtra', 'Bombay High Court'),
('Maharashtra', 'City Civil Court Mumbai'),
('Maharashtra', 'Sessions Court Pune'),
('Maharashtra', 'Nagpur Bench'),
('Karnataka', 'Karnataka High Court'),
('Karnataka', 'City Civil Court Bangalore'),
('Karnataka', 'Sessions Court Mangalore'),
('Tamil Nadu', 'Madras High Court'),
('Tamil Nadu', 'City Civil Court Chennai'),
('Tamil Nadu', 'Madurai Bench'),
('Uttar Pradesh', 'Allahabad High Court'),
('Uttar Pradesh', 'Lucknow Bench'),
('Uttar Pradesh', 'District Court Noida'),
('West Bengal', 'Calcutta High Court'),
('West Bengal', 'City Civil Court Kolkata'),
('Telangana', 'Telangana High Court'),
('Telangana', 'City Civil Court Hyderabad'),
('Gujarat', 'Gujarat High Court'),
('Gujarat', 'City Civil Court Ahmedabad'),
('Rajasthan', 'Rajasthan High Court (Jodhpur)'),
('Rajasthan', 'Jaipur Bench'),
('Kerala', 'Kerala High Court'),
('Kerala', 'District Court Ernakulam'),
('Punjab', 'Punjab & Haryana High Court'),
('Punjab', 'District Court Ludhiana'),
('Madhya Pradesh', 'Madhya Pradesh High Court (Jabalpur)'),
('Madhya Pradesh', 'Indore Bench'),
('Madhya Pradesh', 'Gwalior Bench');
