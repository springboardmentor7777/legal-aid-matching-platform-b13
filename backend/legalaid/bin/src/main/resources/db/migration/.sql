-- Add directory fields to lawyer_profiles
ALTER TABLE lawyer_profiles
    ADD COLUMN IF NOT EXISTS expertise     VARCHAR(255),
    ADD COLUMN IF NOT EXISTS location      VARCHAR(255),
    ADD COLUMN IF NOT EXISTS verified      BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS contact_info  TEXT;

-- Add directory fields to ngo_profiles
ALTER TABLE ngo_profiles
    ADD COLUMN IF NOT EXISTS expertise     VARCHAR(255),
    ADD COLUMN IF NOT EXISTS location      VARCHAR(255),
    ADD COLUMN IF NOT EXISTS verified      BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS contact_info  TEXT;

-- Indexes for search/filter performance
CREATE INDEX IF NOT EXISTS idx_lawyer_location   ON lawyer_profiles(location);
CREATE INDEX IF NOT EXISTS idx_lawyer_expertise  ON lawyer_profiles(expertise);
CREATE INDEX IF NOT EXISTS idx_lawyer_verified   ON lawyer_profiles(verified);

CREATE INDEX IF NOT EXISTS idx_ngo_location      ON ngo_profiles(location);
CREATE INDEX IF NOT EXISTS idx_ngo_expertise     ON ngo_profiles(expertise);
CREATE INDEX IF NOT EXISTS idx_ngo_verified      ON ngo_profiles(verified);