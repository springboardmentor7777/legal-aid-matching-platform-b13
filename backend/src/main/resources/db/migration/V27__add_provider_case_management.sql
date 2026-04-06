-- =============================================
-- V27: Add provider case management columns
-- =============================================
ALTER TABLE matches ADD COLUMN IF NOT EXISTS provider_notes TEXT;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS internal_status VARCHAR(50) DEFAULT 'Reviewing';
