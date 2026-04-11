-- Add user suspension support
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_users_suspended ON users(suspended) WHERE suspended = TRUE;
