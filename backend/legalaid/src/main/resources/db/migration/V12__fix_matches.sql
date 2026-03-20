-- V12: Fix matches table and add messages table
-- Your database already has: profile_id, profile_type, match_date columns
-- Your database does NOT have: lawyer_id, ngo_id columns
-- So we skip data migration and only do the three things below.

-- Step 1: Fix match_score column type from DOUBLE PRECISION to INTEGER
-- (Match entity uses Integer but V10 created it as DOUBLE PRECISION)
ALTER TABLE matches
    ALTER COLUMN match_score TYPE INTEGER USING COALESCE(match_score::INTEGER, 0);

-- Step 2: Ensure indexes exist on profile columns
CREATE INDEX IF NOT EXISTS idx_matches_profile_id   ON matches(profile_id);
CREATE INDEX IF NOT EXISTS idx_matches_profile_type ON matches(profile_type);

-- Step 3: Add created_at to notifications
-- (was missing — frontend needs it to show "2 hours ago" timestamps)
ALTER TABLE notifications
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Step 4: Create the messages table
-- (completely missing from all previous migrations)
CREATE TABLE IF NOT EXISTS messages (
    id          BIGSERIAL PRIMARY KEY,
    match_id    BIGINT    NOT NULL,
    sender_id   BIGINT    NOT NULL,
    receiver_id BIGINT,
    content     TEXT      NOT NULL,
    timestamp   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_messages_match  FOREIGN KEY (match_id)  REFERENCES matches(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id)   ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_match_id  ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);