CREATE TABLE IF NOT EXISTS appointments (
    id              BIGSERIAL PRIMARY KEY,
    match_id        BIGINT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    user_id         BIGINT NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
    scheduled_time  TIMESTAMP NOT NULL,
    duration_minutes INT,
    notes           TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
CREATE INDEX IF NOT EXISTS idx_appointments_match_id  ON appointments(match_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id   ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status    ON appointments(status);