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
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'matches_status_check'
    ) THEN
        ALTER TABLE matches
        ADD CONSTRAINT matches_status_check
        CHECK (status IN ('PENDING','ACCEPTED','REJECTED'));
    END IF;
END $$;

-- Prevent duplicate matches
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_case_provider'
    ) THEN
        ALTER TABLE matches
        ADD CONSTRAINT unique_case_provider
        UNIQUE (case_id, provider_id);
    END IF;
END $$;

-- Appointments status constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'appointment_status_check'
    ) THEN
        ALTER TABLE appointments
        ADD CONSTRAINT appointment_status_check
        CHECK (status IN ('SCHEDULED','COMPLETED','CANCELLED'));
    END IF;
END $$;

-- Notifications type constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'notification_type_check'
    ) THEN
        ALTER TABLE notifications
        ADD CONSTRAINT notification_type_check
        CHECK (type IN ('MATCH','MESSAGE','APPOINTMENT'));
    END IF;
END $$;

-- Add indexes (these are fine 👍)
CREATE INDEX IF NOT EXISTS idx_matches_case_id ON matches(case_id);
CREATE INDEX IF NOT EXISTS idx_matches_provider_id ON matches(provider_id);
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Add read status to messages
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

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