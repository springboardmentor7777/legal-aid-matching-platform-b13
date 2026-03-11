CREATE TABLE IF NOT EXISTS matches (
    id BIGSERIAL PRIMARY KEY,
    case_id BIGINT NOT NULL REFERENCES cases(id),
    profile_id BIGINT NOT NULL,
    profile_type VARCHAR(10) NOT NULL, 
    match_score INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING', 
    match_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_matches_case_id ON matches(case_id);
CREATE INDEX IF NOT EXISTS idx_matches_profile_id ON matches(profile_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);