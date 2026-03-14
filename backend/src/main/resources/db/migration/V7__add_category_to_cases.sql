ALTER TABLE cases
ADD COLUMN category_id INT;

ALTER TABLE cases
ADD CONSTRAINT fk_cases_category
FOREIGN KEY (category_id)
REFERENCES categories(id)
ON DELETE SET NULL;