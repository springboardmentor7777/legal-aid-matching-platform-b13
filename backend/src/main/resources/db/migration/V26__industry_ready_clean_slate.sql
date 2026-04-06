-- =============================================
-- V26: Industry-Ready Clean Slate
-- Comprehensive seed data + schema refinements
-- =============================================

-- ══════════════════════════════════════════════
-- SCHEMA ADDITIONS (safe, idempotent)
-- ══════════════════════════════════════════════

-- Cases table: new structured fields
ALTER TABLE cases ADD COLUMN IF NOT EXISTS desired_outcome TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS when_did_it_happen VARCHAR(255);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS has_upcoming_court_date BOOLEAN DEFAULT FALSE;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS upcoming_court_date DATE;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS case_filed_against_you BOOLEAN DEFAULT FALSE;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS fir_document_name VARCHAR(255);

-- Jurisdictions table: add city column
ALTER TABLE jurisdictions ADD COLUMN IF NOT EXISTS city VARCHAR(150);

-- ══════════════════════════════════════════════
-- WIPE OLD SEED DATA (safe cascade)
-- ══════════════════════════════════════════════
TRUNCATE TABLE matches CASCADE;
TRUNCATE TABLE cases CASCADE;
TRUNCATE TABLE messages CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE appointments CASCADE;
TRUNCATE TABLE ngo_profiles CASCADE;
TRUNCATE TABLE lawyer_profiles CASCADE;
DELETE FROM users;

-- Reset sequences
ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS lawyer_profiles_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS ngo_profiles_id_seq RESTART WITH 1;

-- ══════════════════════════════════════════════
-- SEED: USERS
-- BCrypt hash of 'Password@123'
-- ══════════════════════════════════════════════
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

INSERT INTO users (username, email, password, role, onboarding_complete) VALUES
-- ADMIN
('Admin LegalMatch', 'admin@legalmatch.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', true),

-- CITIZENS
('Rahul Sharma', 'rahul.sharma@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CITIZEN', true),
('Priya Patel', 'priya.patel@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CITIZEN', true),

-- ═══════════════════════════════════════
-- MUMBAI LAWYERS (4)
-- ═══════════════════════════════════════
('Adv. Rajesh Mehta', 'rajesh.mehta@lawfirm.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LAWYER', true),
('Adv. Sneha Kulkarni', 'sneha.kulkarni@lawfirm.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LAWYER', true),
('Adv. Vikram Desai', 'vikram.desai@lawfirm.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LAWYER', true),
('Adv. Anita Joshi', 'anita.joshi@lawfirm.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LAWYER', true),
('Adv. Sunil Patil', 'sunil.patil@lawfirm.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LAWYER', true),

-- ═══════════════════════════════════════
-- DELHI LAWYERS (4)
-- ═══════════════════════════════════════
('Adv. Arjun Kapoor', 'arjun.kapoor@lawfirm.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LAWYER', true),
('Adv. Meera Choudhary', 'meera.choudhary@lawfirm.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LAWYER', true),
('Adv. Rohit Saxena', 'rohit.saxena@lawfirm.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LAWYER', true),
('Adv. Kavita Gupta', 'kavita.gupta@lawfirm.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LAWYER', true),
('Adv. Deepak Verma', 'deepak.verma@lawfirm.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LAWYER', true),

-- ═══════════════════════════════════════
-- BANGALORE LAWYERS (4)
-- ═══════════════════════════════════════
('Adv. Kiran Hegde', 'kiran.hegde@lawfirm.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LAWYER', true),
('Adv. Lakshmi Nair', 'lakshmi.nair@lawfirm.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LAWYER', true),
('Adv. Ravi Reddy', 'ravi.reddy@lawfirm.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LAWYER', true),
('Adv. Pooja Iyengar', 'pooja.iyengar@lawfirm.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LAWYER', true),

-- ═══════════════════════════════════════
-- CHENNAI LAWYERS (4)
-- ═══════════════════════════════════════
('Adv. Senthil Kumar', 'senthil.kumar@lawfirm.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LAWYER', true),
('Adv. Revathi Subramanian', 'revathi.sub@lawfirm.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LAWYER', true),
('Adv. Balaji Krishnan', 'balaji.krishnan@lawfirm.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LAWYER', true),
('Adv. Nithya Ramanathan', 'nithya.rama@lawfirm.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'LAWYER', true),

-- ═══════════════════════════════════════
-- MUMBAI NGOs (4)
-- ═══════════════════════════════════════
('TATA Trusts Legal Aid', 'legal@tatatrusts.org', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'NGO', true),
('Majlis Legal Centre', 'contact@majlislaw.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'NGO', true),
('HRLN Mumbai', 'mumbai@hrln.org', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'NGO', true),
('Pratham Legal Aid', 'legal@pratham.org', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'NGO', true),
('Mumbai Legal Aid Society', 'info@mumbailegalaid.org', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'NGO', true),

-- ═══════════════════════════════════════
-- DELHI NGOs (4)
-- ═══════════════════════════════════════
('DLSA Pro Bono Cell', 'probono@dlsa.gov.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'NGO', true),
('Commonwealth Human Rights Initiative', 'delhi@chri.org', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'NGO', true),
('Lawyers Collective', 'info@lawyerscollective.org', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'NGO', true),
('Centre for Social Justice Delhi', 'delhi@csj.org.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'NGO', true),
('Delhi Legal Aid Foundation', 'contact@dlaf.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'NGO', true),

-- ═══════════════════════════════════════
-- BANGALORE NGOs (4)
-- ═══════════════════════════════════════
('Alternative Law Forum', 'contact@altlawforum.org', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'NGO', true),
('Daksh India', 'info@daksh.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'NGO', true),
('NLSIU Legal Aid Society', 'legalaid@nls.ac.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'NGO', true),
('Bangalore Legal Services', 'help@blegalservices.org', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'NGO', true),

-- ═══════════════════════════════════════
-- CHENNAI NGOs (4)
-- ═══════════════════════════════════════
('Madras Legal Aid Society', 'contact@mlas.org.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'NGO', true),
('TN Legal Services Authority', 'tnlsa@nic.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'NGO', true),
('EKTA Foundation Chennai', 'legal@ektafoundation.org', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'NGO', true),
('People First Chennai', 'legal@peoplefirst.org.in', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'NGO', true);

-- ══════════════════════════════════════════════
-- SEED: LAWYER PROFILES
-- ══════════════════════════════════════════════

-- Mumbai Lawyers
INSERT INTO lawyer_profiles (user_id, name, expertise, location, verified, contact_info, state, city, practice_areas, office_address, bar_council_license) VALUES
((SELECT id FROM users WHERE email='rajesh.mehta@lawfirm.in'), 'Adv. Rajesh Mehta', 'Criminal', 'Mumbai, Maharashtra', true, '+91-9876543210', 'Maharashtra', 'Mumbai', 'Criminal,Litigation,Cyber Crime', 'Suite 401, Maker Chambers IV, Nariman Point, Mumbai 400021', 'MAH/1234/2010'),
((SELECT id FROM users WHERE email='sneha.kulkarni@lawfirm.in'), 'Adv. Sneha Kulkarni', 'Family Law', 'Mumbai, Maharashtra', true, '+91-9876543211', 'Maharashtra', 'Mumbai', 'Family Law,Property Disputes,Consumer Protection', 'Office 12, Jolly Maker Apt, Cuffe Parade, Mumbai 400005', 'MAH/2345/2012'),
((SELECT id FROM users WHERE email='vikram.desai@lawfirm.in'), 'Adv. Vikram Desai', 'Corporate Law', 'Mumbai, Maharashtra', true, '+91-9876543212', 'Maharashtra', 'Mumbai', 'Corporate Law,Intellectual Property,Tax Law', '14th Floor, Express Towers, Nariman Point, Mumbai 400021', 'MAH/3456/2008'),
((SELECT id FROM users WHERE email='anita.joshi@lawfirm.in'), 'Adv. Anita Joshi', 'Human Rights', 'Mumbai, Maharashtra', true, '+91-9876543213', 'Maharashtra', 'Mumbai', 'Human Rights,Environmental Law,Constitutional Law', '305, Mittal Court, Nariman Point, Mumbai 400021', 'MAH/4567/2015'),
((SELECT id FROM users WHERE email='sunil.patil@lawfirm.in'), 'Adv. Sunil Patil', 'Property Disputes', 'Mumbai, Maharashtra', true, '+91-9876543214', 'Maharashtra', 'Mumbai', 'Property Disputes,Labour & Employment,Litigation', '201, B Wing, Trade Centre, Bandra Kurla Complex, Mumbai 400051', 'MAH/5678/2011');

-- Delhi Lawyers
INSERT INTO lawyer_profiles (user_id, name, expertise, location, verified, contact_info, state, city, practice_areas, office_address, bar_council_license) VALUES
((SELECT id FROM users WHERE email='arjun.kapoor@lawfirm.in'), 'Adv. Arjun Kapoor', 'Constitutional Law', 'Delhi, Delhi', true, '+91-9876543220', 'Delhi', 'Delhi', 'Constitutional Law,Human Rights,Litigation', 'Chamber 42, Supreme Court Bar Association, New Delhi 110001', 'DL/1234/2009'),
((SELECT id FROM users WHERE email='meera.choudhary@lawfirm.in'), 'Adv. Meera Choudhary', 'Family Law', 'Delhi, Delhi', true, '+91-9876543221', 'Delhi', 'Delhi', 'Family Law,Consumer Protection,Victim Support', '302, Lawyers Chamber, Tis Hazari Court Complex, Delhi 110054', 'DL/2345/2013'),
((SELECT id FROM users WHERE email='rohit.saxena@lawfirm.in'), 'Adv. Rohit Saxena', 'Criminal', 'Delhi, Delhi', true, '+91-9876543222', 'Delhi', 'Delhi', 'Criminal,Cyber Crime,Litigation', '705, Kailash Building, Kasturba Gandhi Marg, New Delhi 110001', 'DL/3456/2010'),
((SELECT id FROM users WHERE email='kavita.gupta@lawfirm.in'), 'Adv. Kavita Gupta', 'Corporate Law', 'Delhi, Delhi', true, '+91-9876543223', 'Delhi', 'Delhi', 'Corporate Law,Tax Law,Intellectual Property', '5th Floor, Antriksh Bhawan, KG Marg, New Delhi 110001', 'DL/4567/2014'),
((SELECT id FROM users WHERE email='deepak.verma@lawfirm.in'), 'Adv. Deepak Verma', 'Labour & Employment', 'Delhi, Delhi', true, '+91-9876543224', 'Delhi', 'Delhi', 'Labour & Employment,Environmental Law,Property Disputes', '204, Janpath Lane, Connaught Place, New Delhi 110001', 'DL/5678/2012');

-- Bangalore Lawyers
INSERT INTO lawyer_profiles (user_id, name, expertise, location, verified, contact_info, state, city, practice_areas, office_address, bar_council_license) VALUES
((SELECT id FROM users WHERE email='kiran.hegde@lawfirm.in'), 'Adv. Kiran Hegde', 'Intellectual Property', 'Bangalore, Karnataka', true, '+91-9876543230', 'Karnataka', 'Bangalore', 'Intellectual Property,Corporate Law,Cyber Crime', '3rd Floor, Embassy Icon, Infantry Road, Bangalore 560001', 'KAR/1234/2011'),
((SELECT id FROM users WHERE email='lakshmi.nair@lawfirm.in'), 'Adv. Lakshmi Nair', 'Family Law', 'Bangalore, Karnataka', true, '+91-9876543231', 'Karnataka', 'Bangalore', 'Family Law,Human Rights,Victim Support', '12, Brigade Road, Bangalore 560025', 'KAR/2345/2014'),
((SELECT id FROM users WHERE email='ravi.reddy@lawfirm.in'), 'Adv. Ravi Reddy', 'Criminal', 'Bangalore, Karnataka', true, '+91-9876543232', 'Karnataka', 'Bangalore', 'Criminal,Litigation,Constitutional Law', 'Room 105, Court Complex, Nrupatunga Road, Bangalore 560001', 'KAR/3456/2009'),
((SELECT id FROM users WHERE email='pooja.iyengar@lawfirm.in'), 'Adv. Pooja Iyengar', 'Environmental Law', 'Bangalore, Karnataka', true, '+91-9876543233', 'Karnataka', 'Bangalore', 'Environmental Law,Consumer Protection,Property Disputes', '404, Prestige Meridian, MG Road, Bangalore 560001', 'KAR/4567/2016');

-- Chennai Lawyers
INSERT INTO lawyer_profiles (user_id, name, expertise, location, verified, contact_info, state, city, practice_areas, office_address, bar_council_license) VALUES
((SELECT id FROM users WHERE email='senthil.kumar@lawfirm.in'), 'Adv. Senthil Kumar', 'Criminal', 'Chennai, Tamil Nadu', true, '+91-9876543240', 'Tamil Nadu', 'Chennai', 'Criminal,Litigation,Labour & Employment', 'No. 7, Rajaji Salai, High Court Chambers, Chennai 600001', 'TN/1234/2010'),
((SELECT id FROM users WHERE email='revathi.sub@lawfirm.in'), 'Adv. Revathi Subramanian', 'Family Law', 'Chennai, Tamil Nadu', true, '+91-9876543241', 'Tamil Nadu', 'Chennai', 'Family Law,Property Disputes,Consumer Protection', '32, Nungambakkam High Road, Chennai 600034', 'TN/2345/2013'),
((SELECT id FROM users WHERE email='balaji.krishnan@lawfirm.in'), 'Adv. Balaji Krishnan', 'Corporate Law', 'Chennai, Tamil Nadu', true, '+91-9876543242', 'Tamil Nadu', 'Chennai', 'Corporate Law,Intellectual Property,Tax Law', '8th Floor, Chari & Co Building, Anna Salai, Chennai 600002', 'TN/3456/2008'),
((SELECT id FROM users WHERE email='nithya.rama@lawfirm.in'), 'Adv. Nithya Ramanathan', 'Human Rights', 'Chennai, Tamil Nadu', true, '+91-9876543243', 'Tamil Nadu', 'Chennai', 'Human Rights,Environmental Law,Constitutional Law', '15, Luz Church Road, Mylapore, Chennai 600004', 'TN/4567/2015');

-- ══════════════════════════════════════════════
-- SEED: NGO PROFILES
-- ══════════════════════════════════════════════

-- Mumbai NGOs
INSERT INTO ngo_profiles (user_id, organization_name, focus_area, location, verified, contact_info, state, city, focus_areas, office_address, ngo_darpan_id) VALUES
((SELECT id FROM users WHERE email='legal@tatatrusts.org'), 'TATA Trusts Legal Aid', 'Human Rights', 'Mumbai, Maharashtra', true, '+91-22-66658282', 'Maharashtra', 'Mumbai', 'Human Rights,Criminal,Victim Support', 'Bombay House, 24 Homi Mody Street, Fort, Mumbai 400001', 'MH/2017/0123456'),
((SELECT id FROM users WHERE email='contact@majlislaw.com'), 'Majlis Legal Centre', 'Family Law', 'Mumbai, Maharashtra', true, '+91-22-26046744', 'Maharashtra', 'Mumbai', 'Family Law,Consumer Protection,Human Rights', '4th Floor, Kalanagar, Bandra East, Mumbai 400051', 'MH/2015/0234567'),
((SELECT id FROM users WHERE email='mumbai@hrln.org'), 'HRLN Mumbai', 'Human Rights', 'Mumbai, Maharashtra', true, '+91-22-24955662', 'Maharashtra', 'Mumbai', 'Human Rights,Environmental Law,Constitutional Law', 'Jaldarshan, 54 Bhulabhai Desai Road, Mumbai 400026', 'MH/2010/0345678'),
((SELECT id FROM users WHERE email='legal@pratham.org'), 'Pratham Legal Aid', 'Victim Support', 'Mumbai, Maharashtra', true, '+91-22-22815391', 'Maharashtra', 'Mumbai', 'Victim Support,Family Law,Labour & Employment', 'Y.B. Chavan Centre, Gen. J. Bhosale Marg, Mumbai 400021', 'MH/2012/0456789'),
((SELECT id FROM users WHERE email='info@mumbailegalaid.org'), 'Mumbai Legal Aid Society', 'Criminal', 'Mumbai, Maharashtra', true, '+91-22-22850133', 'Maharashtra', 'Mumbai', 'Criminal,Property Disputes,Consumer Protection', 'Room 202, Fountain Building, Fort, Mumbai 400001', 'MH/2014/0567890');

-- Delhi NGOs
INSERT INTO ngo_profiles (user_id, organization_name, focus_area, location, verified, contact_info, state, city, focus_areas, office_address, ngo_darpan_id) VALUES
((SELECT id FROM users WHERE email='probono@dlsa.gov.in'), 'DLSA Pro Bono Cell', 'Criminal', 'Delhi, Delhi', true, '+91-11-23073845', 'Delhi', 'Delhi', 'Criminal,Victim Support,Labour & Employment', 'Patiala House Courts, India Gate, New Delhi 110001', 'DL/2016/0123456'),
((SELECT id FROM users WHERE email='delhi@chri.org'), 'Commonwealth Human Rights Initiative', 'Human Rights', 'Delhi, Delhi', true, '+91-11-43180200', 'Delhi', 'Delhi', 'Human Rights,Constitutional Law,Environmental Law', 'B-117, Sarvodaya Enclave, New Delhi 110017', 'DL/2008/0234567'),
((SELECT id FROM users WHERE email='info@lawyerscollective.org'), 'Lawyers Collective', 'Constitutional Law', 'Delhi, Delhi', true, '+91-11-24373846', 'Delhi', 'Delhi', 'Constitutional Law,Human Rights,Family Law', '63, Masjid Road, Jangpura, New Delhi 110014', 'DL/2005/0345678'),
((SELECT id FROM users WHERE email='delhi@csj.org.in'), 'Centre for Social Justice Delhi', 'Labour & Employment', 'Delhi, Delhi', true, '+91-11-26265810', 'Delhi', 'Delhi', 'Labour & Employment,Property Disputes,Consumer Protection', 'A-12, Nizamuddin West, New Delhi 110013', 'DL/2011/0456789'),
((SELECT id FROM users WHERE email='contact@dlaf.in'), 'Delhi Legal Aid Foundation', 'Family Law', 'Delhi, Delhi', true, '+91-11-23384560', 'Delhi', 'Delhi', 'Family Law,Victim Support,Criminal', 'C-5, Institutional Area, Pankha Road, New Delhi 110058', 'DL/2018/0567890');

-- Bangalore NGOs
INSERT INTO ngo_profiles (user_id, organization_name, focus_area, location, verified, contact_info, state, city, focus_areas, office_address, ngo_darpan_id) VALUES
((SELECT id FROM users WHERE email='contact@altlawforum.org'), 'Alternative Law Forum', 'Constitutional Law', 'Bangalore, Karnataka', true, '+91-80-22868757', 'Karnataka', 'Bangalore', 'Constitutional Law,Human Rights,Environmental Law', '122/4, Infantry Road, Bangalore 560001', 'KA/2010/0123456'),
((SELECT id FROM users WHERE email='info@daksh.in'), 'Daksh India', 'Litigation', 'Bangalore, Karnataka', true, '+91-80-26567873', 'Karnataka', 'Bangalore', 'Litigation,Corporate Law,Consumer Protection', '46, 1st Cross, Sadashivanagar, Bangalore 560080', 'KA/2012/0234567'),
((SELECT id FROM users WHERE email='legalaid@nls.ac.in'), 'NLSIU Legal Aid Society', 'Human Rights', 'Bangalore, Karnataka', true, '+91-80-23160535', 'Karnataka', 'Bangalore', 'Human Rights,Criminal,Victim Support', 'NLSIU Campus, Nagarbhavi, Bangalore 560072', 'KA/2007/0345678'),
((SELECT id FROM users WHERE email='help@blegalservices.org'), 'Bangalore Legal Services', 'Family Law', 'Bangalore, Karnataka', true, '+91-80-22103456', 'Karnataka', 'Bangalore', 'Family Law,Property Disputes,Labour & Employment', '54, Cunningham Road, Vasanth Nagar, Bangalore 560052', 'KA/2015/0456789');

-- Chennai NGOs
INSERT INTO ngo_profiles (user_id, organization_name, focus_area, location, verified, contact_info, state, city, focus_areas, office_address, ngo_darpan_id) VALUES
((SELECT id FROM users WHERE email='contact@mlas.org.in'), 'Madras Legal Aid Society', 'Criminal', 'Chennai, Tamil Nadu', true, '+91-44-25341078', 'Tamil Nadu', 'Chennai', 'Criminal,Victim Support,Labour & Employment', '18, First Line Beach Road, Chennai 600001', 'TN/2009/0123456'),
((SELECT id FROM users WHERE email='tnlsa@nic.in'), 'TN Legal Services Authority', 'Human Rights', 'Chennai, Tamil Nadu', true, '+91-44-25365123', 'Tamil Nadu', 'Chennai', 'Human Rights,Family Law,Consumer Protection', 'High Court Building, Chennai 600104', 'TN/2006/0234567'),
((SELECT id FROM users WHERE email='legal@ektafoundation.org'), 'EKTA Foundation Chennai', 'Family Law', 'Chennai, Tamil Nadu', true, '+91-44-28361245', 'Tamil Nadu', 'Chennai', 'Family Law,Environmental Law,Property Disputes', '23, Ethiraj Salai, Egmore, Chennai 600008', 'TN/2013/0345678'),
((SELECT id FROM users WHERE email='legal@peoplefirst.org.in'), 'People First Chennai', 'Environmental Law', 'Chennai, Tamil Nadu', true, '+91-44-24343567', 'Tamil Nadu', 'Chennai', 'Environmental Law,Constitutional Law,Human Rights', '12, Cenotaph Road, Teynampet, Chennai 600018', 'TN/2016/0456789');

-- ══════════════════════════════════════════════
-- REFRESH: JURISDICTION DATA (with city)
-- ══════════════════════════════════════════════
TRUNCATE TABLE jurisdictions CASCADE;
ALTER SEQUENCE IF EXISTS jurisdictions_id_seq RESTART WITH 1;

INSERT INTO jurisdictions (state, city, court_name) VALUES
-- Delhi
('Delhi', 'New Delhi', 'Supreme Court of India'),
('Delhi', 'New Delhi', 'Delhi High Court'),
('Delhi', 'New Delhi', 'Patiala House Court'),
('Delhi', 'New Delhi', 'Tis Hazari Court'),
('Delhi', 'New Delhi', 'Saket Court'),
('Delhi', 'New Delhi', 'Karkardooma Court'),
('Delhi', 'New Delhi', 'Dwarka Court'),
-- Maharashtra
('Maharashtra', 'Mumbai', 'Bombay High Court'),
('Maharashtra', 'Mumbai', 'City Civil Court Mumbai'),
('Maharashtra', 'Mumbai', 'Sessions Court Mumbai'),
('Maharashtra', 'Pune', 'Sessions Court Pune'),
('Maharashtra', 'Pune', 'District Court Pune'),
('Maharashtra', 'Nagpur', 'Nagpur Bench'),
('Maharashtra', 'Aurangabad', 'Aurangabad Bench'),
-- Karnataka
('Karnataka', 'Bangalore', 'Karnataka High Court'),
('Karnataka', 'Bangalore', 'City Civil Court Bangalore'),
('Karnataka', 'Bangalore', 'Sessions Court Bangalore'),
('Karnataka', 'Mangalore', 'Sessions Court Mangalore'),
('Karnataka', 'Dharwad', 'Dharwad Bench'),
-- Tamil Nadu
('Tamil Nadu', 'Chennai', 'Madras High Court'),
('Tamil Nadu', 'Chennai', 'City Civil Court Chennai'),
('Tamil Nadu', 'Chennai', 'Sessions Court Chennai'),
('Tamil Nadu', 'Madurai', 'Madurai Bench'),
('Tamil Nadu', 'Coimbatore', 'District Court Coimbatore'),
-- Uttar Pradesh
('Uttar Pradesh', 'Prayagraj', 'Allahabad High Court'),
('Uttar Pradesh', 'Lucknow', 'Lucknow Bench'),
('Uttar Pradesh', 'Noida', 'District Court Noida'),
('Uttar Pradesh', 'Varanasi', 'District Court Varanasi'),
-- West Bengal
('West Bengal', 'Kolkata', 'Calcutta High Court'),
('West Bengal', 'Kolkata', 'City Civil Court Kolkata'),
('West Bengal', 'Kolkata', 'Sessions Court Kolkata'),
-- Telangana
('Telangana', 'Hyderabad', 'Telangana High Court'),
('Telangana', 'Hyderabad', 'City Civil Court Hyderabad'),
('Telangana', 'Hyderabad', 'Nampally Court'),
-- Gujarat
('Gujarat', 'Ahmedabad', 'Gujarat High Court'),
('Gujarat', 'Ahmedabad', 'City Civil Court Ahmedabad'),
('Gujarat', 'Surat', 'District Court Surat'),
-- Rajasthan
('Rajasthan', 'Jodhpur', 'Rajasthan High Court (Jodhpur)'),
('Rajasthan', 'Jaipur', 'Jaipur Bench'),
('Rajasthan', 'Jaipur', 'District Court Jaipur'),
-- Kerala
('Kerala', 'Ernakulam', 'Kerala High Court'),
('Kerala', 'Ernakulam', 'District Court Ernakulam'),
('Kerala', 'Thiruvananthapuram', 'District Court Trivandrum'),
-- Punjab
('Punjab', 'Chandigarh', 'Punjab & Haryana High Court'),
('Punjab', 'Ludhiana', 'District Court Ludhiana'),
('Punjab', 'Amritsar', 'District Court Amritsar'),
-- Madhya Pradesh
('Madhya Pradesh', 'Jabalpur', 'Madhya Pradesh High Court (Jabalpur)'),
('Madhya Pradesh', 'Indore', 'Indore Bench'),
('Madhya Pradesh', 'Gwalior', 'Gwalior Bench'),
('Madhya Pradesh', 'Bhopal', 'District Court Bhopal');
