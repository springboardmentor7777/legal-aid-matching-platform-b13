-- Remove duplicate timestamp column

ALTER TABLE messages
DROP COLUMN IF EXISTS timestamp;