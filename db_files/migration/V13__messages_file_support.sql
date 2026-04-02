-- V13__messages_file_support.sql
-- Add file attachment columns to messages table for document sharing in chat

ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_data  TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_name  VARCHAR(255);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_type  VARCHAR(100);