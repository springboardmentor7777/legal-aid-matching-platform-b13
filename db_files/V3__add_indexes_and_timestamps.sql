-- Add timestamps to lawyer_profiles
ALTER TABLE lawyer_profiles
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP;

-- Add timestamps to ngo_profiles
ALTER TABLE ngo_profiles
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP;

-- Add index for lawyer location (for search performance)
CREATE INDEX idx_lawyer_location
ON lawyer_profiles(location);

-- Add index for lawyer expertise
CREATE INDEX idx_lawyer_expertise
ON lawyer_profiles(expertise);

-- Add index for NGO location
CREATE INDEX idx_ngo_location
ON ngo_profiles(location);