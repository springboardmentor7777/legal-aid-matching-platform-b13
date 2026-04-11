CREATE TABLE IF NOT EXISTS audit_logs (
    id              BIGSERIAL PRIMARY KEY,
    event_type      VARCHAR(100)  NOT NULL,
    severity        VARCHAR(20)   NOT NULL DEFAULT 'INFO',
    source          VARCHAR(100),
    message         TEXT          NOT NULL,
    user_id         BIGINT        REFERENCES users(id) ON DELETE SET NULL,
    ip_address      VARCHAR(50),
    metadata        TEXT,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Seed initial audit log entries
INSERT INTO audit_logs (event_type, severity, source, message, created_at) VALUES
    ('SYSTEM_STARTUP', 'INFO', 'Application', 'LegalMatch Pro platform started successfully', NOW() - INTERVAL '7 days'),
    ('USER_REGISTERED', 'INFO', 'AuthService', 'New citizen user registered: citizen@example.com', NOW() - INTERVAL '6 days'),
    ('USER_REGISTERED', 'INFO', 'AuthService', 'New lawyer user registered: lawyer@example.com', NOW() - INTERVAL '5 days'),
    ('CASE_SUBMITTED', 'INFO', 'CaseService', 'New case submitted: Property Dispute (#1)', NOW() - INTERVAL '4 days'),
    ('MATCH_CREATED', 'INFO', 'MatchService', 'Match generated for Case #1 with score 85%', NOW() - INTERVAL '3 days'),
    ('MATCH_ACCEPTED', 'INFO', 'MatchService', 'Match #1 accepted by provider', NOW() - INTERVAL '2 days'),
    ('VERIFICATION_PENDING', 'WARN', 'AdminService', 'Lawyer profile awaiting verification: lawyer@example.com', NOW() - INTERVAL '1 day'),
    ('SYSTEM_HEALTH_CHECK', 'INFO', 'HealthMonitor', 'Scheduled health check passed', NOW() - INTERVAL '12 hours'),
    ('DATABASE_MIGRATION', 'INFO', 'Flyway', 'Migration V29 applied successfully', NOW());
