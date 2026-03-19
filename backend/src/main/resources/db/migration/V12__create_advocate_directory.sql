CREATE TABLE advocate_directory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    specialization TEXT,
    location VARCHAR(150),
    contact_info TEXT,
    verified BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_advocate_location ON advocate_directory(location);
CREATE INDEX idx_advocate_name ON advocate_directory(name);