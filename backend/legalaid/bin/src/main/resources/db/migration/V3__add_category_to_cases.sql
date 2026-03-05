-- Add category column to cases table
ALTER TABLE cases 
ADD COLUMN category VARCHAR(255);

-- Set default value for existing rows (if any)
UPDATE cases SET category = 'other' WHERE category IS NULL;

-- Make it NOT NULL
ALTER TABLE cases 
ALTER COLUMN category SET NOT NULL;

-- Add index for better performance
CREATE INDEX idx_cases_category ON cases(category);