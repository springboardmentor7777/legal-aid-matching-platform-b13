CREATE TABLE IF NOT EXISTS matches (
    id          BIGSERIAL PRIMARY KEY,
    created_at  TIMESTAMP(6) WITHOUT TIME ZONE,
    match_score DOUBLE PRECISION,
    status      CHARACTER VARYING(255),
    updated_at  TIMESTAMP(6) WITHOUT TIME ZONE,
    lawyer_id   BIGINT,
    case_id     BIGINT,
    ngo_id      BIGINT
);

CREATE INDEX IF NOT EXISTS idx_matches_lawyer_id ON matches(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_matches_case_id ON matches(case_id);
CREATE INDEX IF NOT EXISTS idx_matches_ngo_id ON matches(ngo_id);