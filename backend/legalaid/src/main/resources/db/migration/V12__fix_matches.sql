-- V12__fix_matches.sql
-- Complete migration: fixes matches table + creates notifications + messages tables

-- ── MATCHES: add profile_id and profile_type columns ─────────────────────────
ALTER TABLE matches ADD COLUMN IF NOT EXISTS profile_id   BIGINT;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS profile_type VARCHAR(20);
ALTER TABLE matches ADD COLUMN IF NOT EXISTS match_date   TIMESTAMP;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS match_score  INTEGER;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS status       VARCHAR(20) DEFAULT 'PENDING';
ALTER TABLE matches ADD COLUMN IF NOT EXISTS created_at   TIMESTAMP   DEFAULT NOW();

-- Migrate existing lawyer_id → profile_id with type LAWYER
UPDATE matches SET profile_id = lawyer_id, profile_type = 'LAWYER'
WHERE lawyer_id IS NOT NULL AND profile_id IS NULL;

-- Migrate existing ngo_id → profile_id with type NGO
UPDATE matches SET profile_id = ngo_id, profile_type = 'NGO'
WHERE ngo_id IS NOT NULL AND profile_id IS NULL AND lawyer_id IS NULL;

-- Indexes on new profile columns
CREATE INDEX IF NOT EXISTS idx_matches_profile_id   ON matches(profile_id);
CREATE INDEX IF NOT EXISTS idx_matches_profile_type ON matches(profile_type);

-- ── NOTIFICATIONS table ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
    id         BIGSERIAL    PRIMARY KEY,
    user_id    BIGINT,
    message    TEXT,
    type       VARCHAR(50),
    read       BOOLEAN      DEFAULT FALSE,
    created_at TIMESTAMP    DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- ── MESSAGES table (for chat) ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
    id          BIGSERIAL PRIMARY KEY,
    match_id    BIGINT    NOT NULL,
    sender_id   BIGINT    NOT NULL,
    receiver_id BIGINT,
    content     TEXT      NOT NULL,
    timestamp   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);