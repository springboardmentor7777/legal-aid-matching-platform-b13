-- ===============================
-- V15: Update profiles for matching
-- ===============================

-- Lawyer profiles updates
ALTER TABLE lawyer_profiles 
ADD COLUMN IF NOT EXISTS availability BOOLEAN DEFAULT TRUE;

ALTER TABLE lawyer_profiles 
ADD COLUMN IF NOT EXISTS experience_years INT DEFAULT 0;

-- NGO profiles updates
ALTER TABLE ngo_profiles 
ADD COLUMN IF NOT EXISTS availability BOOLEAN DEFAULT TRUE;

ALTER TABLE ngo_profiles 
ADD COLUMN IF NOT EXISTS experience_years INT DEFAULT 0;

-- ===============================
-- V16: Schema improvements
-- ===============================

-- Matches status constraint
ALTER TABLE matches
ADD CONSTRAINT IF NOT EXISTS matches_status_check
CHECK (status IN ('PENDING','ACCEPTED','REJECTED'));

-- Prevent duplicate matches
ALTER TABLE matches
ADD CONSTRAINT IF NOT EXISTS unique_case_provider
UNIQUE (case_id, provider_id);

-- Appointments status constraint
ALTER TABLE appointments
ADD CONSTRAINT IF NOT EXISTS appointment_status_check
CHECK (status IN ('SCHEDULED','COMPLETED','CANCELLED'));

-- Notifications type constraint
ALTER TABLE notifications
ADD CONSTRAINT IF NOT EXISTS notification_type_check
CHECK (type IN ('MATCH','MESSAGE','APPOINTMENT'));

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_matches_case_id ON matches(case_id);
CREATE INDEX IF NOT EXISTS idx_matches_provider_id ON matches(provider_id);
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Add read status to messages
ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- Trigger for appointments updated_at
CREATE OR REPLACE FUNCTION update_appointments_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_appointments_timestamp ON appointments;

CREATE TRIGGER update_appointments_timestamp
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_appointments_timestamp();