-- V16__matches_add_updated_at.sql
-- Adds the updated_at column to the matches table.
-- This is required because the Match entity now uses @UpdateTimestamp
-- which Hibernate maps to this column.

ALTER TABLE matches ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

-- Backfill existing rows so the column is not null
UPDATE matches SET updated_at = created_at WHERE updated_at IS NULL;