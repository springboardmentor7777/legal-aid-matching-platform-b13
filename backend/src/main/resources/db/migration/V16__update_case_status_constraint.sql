ALTER TABLE cases DROP CONSTRAINT IF EXISTS case_status_check;

ALTER TABLE cases ADD CONSTRAINT case_status_check
CHECK (status IN (
    'OPEN',
    'SUBMITTED',
    'PENDING',
    'IN_REVIEW',
    'ACTIVE',
    'IN_PROGRESS',
    'MATCHED',
    'RESOLVED',
    'CLOSED'
));