CREATE TABLE lawyer_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    name VARCHAR(150),
    expertise TEXT,
    location VARCHAR(150),
    verified BOOLEAN DEFAULT FALSE,
    contact_info TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE ngo_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    organization_name VARCHAR(200),
    focus_area TEXT,
    location VARCHAR(150),
    verified BOOLEAN DEFAULT FALSE,
    contact_info TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);