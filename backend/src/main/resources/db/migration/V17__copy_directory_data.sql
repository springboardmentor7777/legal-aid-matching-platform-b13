-- Copy advocate data
INSERT INTO directory_profiles (user_id, expertise, location, verified)
SELECT user_id, expertise, location, true
FROM advocate_directory
WHERE user_id NOT IN (
    SELECT user_id FROM directory_profiles
);

-- Copy NGO data
INSERT INTO directory_profiles (user_id, expertise, location, verified)
SELECT user_id, expertise, location, true
FROM ngo_directory
WHERE user_id NOT IN (
    SELECT user_id FROM directory_profiles
);