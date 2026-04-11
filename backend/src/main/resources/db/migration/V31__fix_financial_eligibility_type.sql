-- Cast financial_eligibility to BOOLEAN for JPA entity compatibility
ALTER TABLE cases
    ALTER COLUMN financial_eligibility TYPE BOOLEAN
    USING CASE
        WHEN financial_eligibility IS NULL THEN NULL
        WHEN financial_eligibility::text IN ('true', 'TRUE', 't', '1', 'yes') THEN TRUE
        ELSE FALSE
    END;
