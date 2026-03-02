-- Add created_at column if missing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cases' AND column_name='created_at') THEN
        ALTER TABLE cases ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Added created_at column';
    ELSE
        RAISE NOTICE 'created_at column already exists';
    END IF;
END $$;

-- Ensure updated_at exists (it does from your error)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cases' AND column_name='updated_at') THEN
        ALTER TABLE cases ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Added updated_at column';
    ELSE
        RAISE NOTICE 'updated_at column already exists';
    END IF;
END $$;

-- Update NULL values to current timestamp
UPDATE cases SET created_at = NOW() WHERE created_at IS NULL;
UPDATE cases SET updated_at = NOW() WHERE updated_at IS NULL;

-- Make sure columns are NOT NULL
ALTER TABLE cases ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE cases ALTER COLUMN updated_at SET NOT NULL;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cases_updated_at ON cases(updated_at DESC);