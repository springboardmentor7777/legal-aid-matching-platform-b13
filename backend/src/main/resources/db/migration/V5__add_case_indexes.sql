-- Index for searching cases by user
CREATE INDEX idx_cases_user_id
ON cases(user_id);

-- Index for filtering cases by status
CREATE INDEX idx_cases_status
ON cases(status);