CREATE TABLE ngo_directory (
    id SERIAL PRIMARY KEY,
    organization_name VARCHAR(200),
    focus_area TEXT,
    location VARCHAR(150),
    verified BOOLEAN DEFAULT FALSE,
    contact_info TEXT
);