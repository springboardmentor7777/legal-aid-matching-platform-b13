-- ============================================
-- SEED DATA: Users, Lawyers, NGOs
-- Password for all users: password123
-- ============================================

INSERT INTO users (full_name, email, password, role, provider, created_at) VALUES
('Rahul Sharma', 'rahul@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8RG6.3OZWB8/gfCdCu', 'USER', 'local', NOW()),
('Priya Reddy', 'priya@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8RG6.3OZWB8/gfCdCu', 'USER', 'local', NOW()),
('Suresh Kumar', 'suresh@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8RG6.3OZWB8/gfCdCu', 'USER', 'local', NOW()),
('Anita Verma', 'anita@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8RG6.3OZWB8/gfCdCu', 'USER', 'local', NOW()),
('Adv. Vikram Singh', 'vikram@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8RG6.3OZWB8/gfCdCu', 'LAWYER', 'local', NOW()),
('Adv. Meena Iyer', 'meena@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8RG6.3OZWB8/gfCdCu', 'LAWYER', 'local', NOW()),
('Adv. Rajan Pillai', 'rajan@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8RG6.3OZWB8/gfCdCu', 'LAWYER', 'local', NOW()),
('Legal Help Foundation', 'legalhelp@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8RG6.3OZWB8/gfCdCu', 'NGO', 'local', NOW()),
('Justice For All NGO', 'justiceforall@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8RG6.3OZWB8/gfCdCu', 'NGO', 'local', NOW()),
('Citizens Rights India', 'citizenrights@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8RG6.3OZWB8/gfCdCu', 'NGO', 'local', NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO lawyer_profiles (user_id, specialization, expertise, location, experience_years, verified, is_available, contact_info)
SELECT id, 'Criminal Law', 'Criminal Law', 'Hyderabad', 8, true, true, '9876543210' FROM users WHERE email = 'vikram@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO lawyer_profiles (user_id, specialization, expertise, location, experience_years, verified, is_available, contact_info)
SELECT id, 'Family Law', 'Family Law', 'Bangalore', 5, true, true, '9876543211' FROM users WHERE email = 'meena@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO lawyer_profiles (user_id, specialization, expertise, location, experience_years, verified, is_available, contact_info)
SELECT id, 'Property Law', 'Property Law', 'Chennai', 12, true, true, '9876543212' FROM users WHERE email = 'rajan@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO ngo_profiles (user_id, organization_name, expertise, location, verified, is_active, contact_info)
SELECT id, 'Legal Help Foundation', 'Human Rights', 'Hyderabad', true, true, 'legalhelp@gmail.com' FROM users WHERE email = 'legalhelp@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO ngo_profiles (user_id, organization_name, expertise, location, verified, is_active, contact_info)
SELECT id, 'Justice For All NGO', 'Civil Law', 'Mumbai', true, true, 'justiceforall@gmail.com' FROM users WHERE email = 'justiceforall@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO ngo_profiles (user_id, organization_name, expertise, location, verified, is_active, contact_info)
SELECT id, 'Citizens Rights India', 'Labour Law', 'Delhi', true, true, 'citizenrights@gmail.com' FROM users WHERE email = 'citizenrights@gmail.com'
ON CONFLICT (user_id) DO NOTHING;