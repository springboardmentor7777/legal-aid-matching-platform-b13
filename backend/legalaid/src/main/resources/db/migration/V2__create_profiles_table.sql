CREATE TABLE IF NOT EXISTS lawyer_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    specialization VARCHAR(100),
    experience_years INT,
    CONSTRAINT fk_lawyer_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ngo_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    organization_name VARCHAR(150),
    registration_number VARCHAR(100),
    CONSTRAINT fk_ngo_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
