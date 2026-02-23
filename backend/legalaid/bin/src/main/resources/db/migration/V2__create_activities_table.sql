-- Create cases table
CREATE TABLE IF NOT EXISTS cases (
    id BIGSERIAL PRIMARY KEY,
    case_title VARCHAR(255) NOT NULL,
    case_description TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    case_type VARCHAR(100),
    filed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hearing_date TIMESTAMP,
    court_name VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    client_id BIGINT,
    assigned_to_id BIGINT,
    ngo_id BIGINT,
    
    CONSTRAINT fk_cases_client
        FOREIGN KEY (client_id) 
        REFERENCES users(id) ON DELETE SET NULL,
    
    CONSTRAINT fk_cases_assigned_to
        FOREIGN KEY (assigned_to_id) 
        REFERENCES users(id) ON DELETE SET NULL,
    
    CONSTRAINT fk_cases_ngo
        FOREIGN KEY (ngo_id) 
        REFERENCES ngo_profiles(id) ON DELETE SET NULL
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT,
    case_id BIGINT,
    
    CONSTRAINT fk_activities_user
        FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    
    CONSTRAINT fk_activities_case
        FOREIGN KEY (case_id) 
        REFERENCES cases(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cases_client_id ON cases(client_id);
CREATE INDEX IF NOT EXISTS idx_cases_assigned_to_id ON cases(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_cases_ngo_id ON cases(ngo_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_filed_date ON cases(filed_date DESC);
CREATE INDEX IF NOT EXISTS idx_cases_hearing_date ON cases(hearing_date);

CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_case_id ON activities(case_id);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);