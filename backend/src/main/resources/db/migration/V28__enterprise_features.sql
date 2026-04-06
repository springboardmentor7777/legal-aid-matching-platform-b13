-- =============================================
-- V28: Enterprise Features - Milestone 4
-- Adds user suspension support
-- =============================================

-- Add suspended column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended BOOLEAN DEFAULT FALSE;

-- Create index for quick suspended-user lookups
CREATE INDEX IF NOT EXISTS idx_users_suspended ON users(suspended) WHERE suspended = TRUE;
