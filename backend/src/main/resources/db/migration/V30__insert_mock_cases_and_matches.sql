-- Seed citizen users (BCrypt hash of 'Password@123')
INSERT INTO users (username, email, password, role, onboarding_complete) VALUES
('Amit Verma',        'amit.verma@gmail.com',        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CITIZEN', true),
('Sunita Devi',       'sunita.devi@gmail.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CITIZEN', true),
('Mohammad Irfan',    'mohammad.irfan@gmail.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CITIZEN', true),
('Lakshmi Menon',     'lakshmi.menon@gmail.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CITIZEN', true),
('Deepa Krishnan',    'deepa.krishnan@gmail.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CITIZEN', true),
('Rajendra Singh',    'rajendra.singh@gmail.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CITIZEN', true);


-- Demo cases

INSERT INTO cases (user_id, case_type, description, urgency, location, status,
    petitioner_name, petitioner_contact, petitioner_address,
    respondent_name, respondent_contact, respondent_address,
    jurisdiction_city, jurisdiction_state, court_name,
    financial_eligibility, annual_income,
    what_happened, desired_outcome, when_did_it_happen,
    preferred_language, incident_date, created_at, updated_at)
VALUES (
    (SELECT id FROM users WHERE email='sunita.devi@gmail.com'),
    'Family Law', 
    'My husband has been physically abusing me for the past 3 years. He also restricts my movement and does not allow me to work. I have two children aged 5 and 8. I need protection and want to file for divorce along with custody of my children.',
    'HIGH', 'Mumbai, Maharashtra', 'MATCHED',
    'Sunita Devi', '+91-9823456701', '42, Dharavi Main Road, Sion, Mumbai 400017',
    'Ramesh Devi', '+91-9823456702', '42, Dharavi Main Road, Sion, Mumbai 400017',
    'Mumbai', 'Maharashtra', 'Sessions Court Mumbai',
    true, 180000.00,
    'Continuous domestic violence including physical assault, verbal abuse, and economic control. Most recent incident was last week when he threw utensils at me in front of the children.',
    'Protection order under DV Act, divorce with custody of both children, maintenance for self and children',
    '3 years ongoing, latest incident last week',
    'Hindi', '2026-03-30', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'
);

INSERT INTO cases (user_id, case_type, description, urgency, location, status,
    petitioner_name, petitioner_contact, petitioner_address,
    respondent_name, respondent_contact, respondent_address,
    jurisdiction_city, jurisdiction_state, court_name,
    financial_eligibility, annual_income,
    what_happened, desired_outcome, when_did_it_happen,
    preferred_language, incident_date, created_at, updated_at)
VALUES (
    (SELECT id FROM users WHERE email='amit.verma@gmail.com'),
    'Property Disputes',
    'My ancestral property in Chandni Chowk is being illegally occupied by my uncle. The property was left to me by my grandfather through a registered will. My uncle forged documents to claim ownership and has locked me out of the property since January 2026.',
    'MEDIUM', 'Delhi, Delhi', 'MATCHED',
    'Amit Verma', '+91-9812345601', 'B-14, Lajpat Nagar-II, New Delhi 110024',
    'Suresh Verma', '+91-9812345602', '156, Chandni Chowk, Old Delhi 110006',
    'Delhi', 'Delhi', 'Tis Hazari Court',
    false, 450000.00,
    'Uncle Suresh Verma has illegally occupied our ancestral haveli in Chandni Chowk. He forged property documents and changed the locks. I have the original registered will from my grandfather naming me as sole heir.',
    'Eviction of illegal occupant, restoration of possession, compensation for damages',
    'January 2026',
    'Hindi', '2026-01-15', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'
);

INSERT INTO cases (user_id, case_type, description, urgency, location, status,
    petitioner_name, petitioner_contact, petitioner_address,
    respondent_name,
    jurisdiction_city, jurisdiction_state, court_name,
    financial_eligibility, annual_income,
    what_happened, desired_outcome, when_did_it_happen,
    fir_number, fir_date, police_station,
    preferred_language, incident_date, created_at, updated_at)
VALUES (
    (SELECT id FROM users WHERE email='mohammad.irfan@gmail.com'),
    'Criminal',
    'I was falsely accused of theft by my employer and an FIR has been filed against me. I am a daily wage worker at a construction site. The owner accused me of stealing construction materials worth Rs 2 lakhs. I was in my village during the alleged theft period.',
    'HIGH', 'Delhi, Delhi', 'SUBMITTED',
    'Mohammad Irfan', '+91-9834567801', 'House 22, JJ Colony, Madanpur Khadar, New Delhi 110076',
    'M/s Sharma Constructions Pvt Ltd',
    'Delhi', 'Delhi', 'Saket Court',
    true, 120000.00,
    'Employer M/s Sharma Constructions filed false FIR accusing me of stealing construction materials. I was in my village in Azamgarh from March 1-10 during the alleged theft. I have bus tickets and village panchayat certificate as alibi.',
    'Quashing of FIR, compensation for harassment and loss of livelihood',
    'FIR filed on March 15, 2026',
    'FIR-0342/2026', '2026-03-15', 'Saket Police Station',
    'Hindi', '2026-03-15', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'
);

INSERT INTO cases (user_id, case_type, description, urgency, location, status,
    petitioner_name, petitioner_contact, petitioner_address,
    respondent_name,
    jurisdiction_city, jurisdiction_state, court_name,
    financial_eligibility, annual_income,
    what_happened, desired_outcome, when_did_it_happen,
    preferred_language, incident_date, created_at, updated_at)
VALUES (
    (SELECT id FROM users WHERE email='rajendra.singh@gmail.com'),
    'Labour & Employment',
    'I worked as a security guard at a corporate office for 4 years. I was terminated without notice or severance pay. The company owes me 3 months salary, PF contributions, and gratuity. They also did not provide any termination letter.',
    'MEDIUM', 'Mumbai, Maharashtra', 'MATCHED',
    'Rajendra Singh', '+91-9845678901', 'Room 3, Kamgar Nagar, Worli, Mumbai 400018',
    'SecureWatch Services Pvt Ltd',
    'Mumbai', 'Maharashtra', 'City Civil Court Mumbai',
    true, 216000.00,
    'Terminated without notice after 4 years of service as security guard. Company refuses to pay 3 months pending salary (Rs 54,000), PF contributions, and gratuity. No termination letter was given.',
    'Payment of pending salary, PF, gratuity, and compensation for illegal termination',
    'Terminated on February 28, 2026',
    'Hindi', '2026-02-28', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'
);

INSERT INTO cases (user_id, case_type, description, urgency, location, status,
    petitioner_name, petitioner_contact, petitioner_address,
    respondent_name,
    jurisdiction_city, jurisdiction_state, court_name,
    financial_eligibility, annual_income,
    what_happened, desired_outcome, when_did_it_happen,
    preferred_language, incident_date, created_at, updated_at)
VALUES (
    (SELECT id FROM users WHERE email='deepa.krishnan@gmail.com'),
    'Environmental Law',
    'A chemical factory near our residential area is dumping toxic waste into the local lake. The water has turned black and several children in the area have developed skin rashes. We have complaints from 50 families. KSPCB has not responded to our complaints.',
    'HIGH', 'Bangalore, Karnataka', 'SUBMITTED',
    'Deepa Krishnan', '+91-9867890123', '45, 3rd Cross, JP Nagar 6th Phase, Bangalore 560078',
    'Apex Chemicals Industrial Unit',
    'Bangalore', 'Karnataka', 'Karnataka High Court',
    false, 720000.00,
    'Apex Chemicals factory has been dumping industrial waste into Agara Lake for the past 6 months. Multiple complaints to KSPCB have gone unanswered. 12 children have developed skin diseases. We have water test reports showing toxic levels of lead and mercury.',
    'Closure of factory, cleanup of lake, compensation for affected families, medical expenses',
    '6 months ongoing',
    'English', '2025-10-01', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'
);

INSERT INTO cases (user_id, case_type, description, urgency, location, status,
    petitioner_name, petitioner_contact, petitioner_address,
    respondent_name,
    jurisdiction_city, jurisdiction_state, court_name,
    financial_eligibility, annual_income,
    what_happened, desired_outcome, when_did_it_happen,
    preferred_language, incident_date, created_at, updated_at)
VALUES (
    (SELECT id FROM users WHERE email='lakshmi.menon@gmail.com'),
    'Consumer Protection',
    'I purchased a flat in an upcoming residential project and paid Rs 35 lakhs over 2 years. The builder has not delivered the flat despite the promised completion date passing 18 months ago. Builder is now demanding additional charges.',
    'MEDIUM', 'Chennai, Tamil Nadu', 'MATCHED',
    'Lakshmi Menon', '+91-9878901234', '12, Warren Road, Mylapore, Chennai 600004',
    'SkyHigh Builders Pvt Ltd',
    'Chennai', 'Tamil Nadu', 'City Civil Court Chennai',
    false, 900000.00,
    'Paid Rs 35 lakhs for a 2BHK flat in SkyHigh Towers project with promised delivery in Dec 2024. Flat not delivered, builder now demands Rs 5 lakhs as "escalation charges". Builder has not responded to legal notice sent in January.',
    'Delivery of flat or full refund with interest, compensation for mental harassment',
    'Delivery was due December 2024',
    'Tamil', '2024-12-31', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'
);

INSERT INTO cases (user_id, case_type, description, urgency, location, status,
    petitioner_name, petitioner_contact, petitioner_address,
    respondent_name,
    jurisdiction_city, jurisdiction_state, court_name,
    financial_eligibility, annual_income,
    what_happened, desired_outcome, when_did_it_happen,
    preferred_language, incident_date, created_at, updated_at)
VALUES (
    (SELECT id FROM users WHERE email='rahul.sharma@gmail.com'),
    'Human Rights',
    'Our slum community of 200 families is facing forced eviction without proper rehabilitation. The municipal corporation served demolition notices with only 7 days to vacate. No alternative housing has been offered as mandated by Supreme Court guidelines.',
    'HIGH', 'Delhi, Delhi', 'MATCHED',
    'Rahul Sharma', '+91-9876543210', 'Jhuggi No. 45, Yamuna Pushta, New Delhi 110006',
    'North Delhi Municipal Corporation',
    'Delhi', 'Delhi', 'Delhi High Court',
    true, 96000.00,
    'Municipal corporation issued 7-day demolition notice to 200 families in Yamuna Pushta slum. No survey conducted, no rehabilitation plan offered. Violates Supreme Court directive in Sudama Singh vs Government of Delhi.',
    'Stay on demolition, proper survey and rehabilitation plan as per Supreme Court guidelines',
    'Demolition notice received April 1, 2026',
    'Hindi', '2026-04-01', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'
);

INSERT INTO cases (user_id, case_type, description, urgency, location, status,
    petitioner_name, petitioner_contact, petitioner_address,
    respondent_name,
    jurisdiction_city, jurisdiction_state, court_name,
    financial_eligibility, annual_income,
    what_happened, desired_outcome, when_did_it_happen,
    preferred_language, incident_date, created_at, updated_at)
VALUES (
    (SELECT id FROM users WHERE email='priya.patel@gmail.com'),
    'Intellectual Property',
    'My startup app design and code has been copied by a competitor. I have prior copyright registration and can prove code similarity of over 80%. The competitor launched their app 3 months after I shared a demo with them under NDA.',
    'MEDIUM', 'Mumbai, Maharashtra', 'SUBMITTED',
    'Priya Patel', '+91-9876543211', 'A-401, Hiranandani Gardens, Powai, Mumbai 400076',
    'QuickCopy Technologies Pvt Ltd',
    'Mumbai', 'Maharashtra', 'Bombay High Court',
    false, 1200000.00,
    'Shared app demo with QuickCopy under NDA in October 2025. They launched an almost identical app in January 2026. Code similarity analysis shows 82% match. I have copyright registration dated August 2025.',
    'Injunction against competitor, damages for IP theft, destruction of infringing copies',
    'Competitor app launched January 2026',
    'English', '2026-01-10', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'
);

INSERT INTO cases (user_id, case_type, description, urgency, location, status,
    petitioner_name, petitioner_contact, petitioner_address,
    respondent_name,
    jurisdiction_city, jurisdiction_state, court_name,
    financial_eligibility, annual_income,
    what_happened, desired_outcome, when_did_it_happen,
    preferred_language, incident_date, created_at, updated_at)
VALUES (
    (SELECT id FROM users WHERE email='amit.verma@gmail.com'),
    'Family Law',
    'My elderly parents (aged 75 and 72) are being neglected by my brother who is their primary caretaker. He has stopped providing food and medicines and is trying to sell their house without consent. I live in another city and need legal intervention.',
    'HIGH', 'Delhi, Delhi', 'SUBMITTED',
    'Amit Verma (on behalf of parents)', '+91-9812345601', 'B-14, Lajpat Nagar-II, New Delhi 110024',
    'Manoj Verma',
    'Delhi', 'Delhi', 'Patiala House Court',
    false, 450000.00,
    'Brother Manoj Verma not providing food or medicine to elderly parents. Attempting to forge property sale deed. Parents are bedridden and cannot approach court themselves. Neighbours have witnessed neglect.',
    'Maintenance order under Maintenance and Welfare of Parents Act, injunction on property sale',
    'Ongoing since February 2026',
    'Hindi', '2026-02-01', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'
);

INSERT INTO cases (user_id, case_type, description, urgency, location, status,
    petitioner_name, petitioner_contact, petitioner_address,
    respondent_name,
    jurisdiction_city, jurisdiction_state, court_name,
    financial_eligibility, annual_income,
    what_happened, desired_outcome, when_did_it_happen,
    preferred_language, incident_date, created_at, updated_at)
VALUES (
    (SELECT id FROM users WHERE email='mohammad.irfan@gmail.com'),
    'Human Rights',
    'My ration card application has been pending for 14 months despite submitting all documents. The PDS office keeps asking for bribes. My family of 6 including 3 children is unable to access subsidized food grains. RTI reply confirms application is "approved" but card not issued.',
    'HIGH', 'Delhi, Delhi', 'SUBMITTED',
    'Mohammad Irfan', '+91-9834567801', 'House 22, JJ Colony, Madanpur Khadar, New Delhi 110076',
    'PDS Office, South-East Delhi',
    'Delhi', 'Delhi', 'Delhi High Court',
    true, 120000.00,
    'Applied for ration card in February 2025. All documents submitted. RTI reply says application approved but card never issued. PDS office demands Rs 5000 bribe. Family of 6 with 3 children unable to get subsidized rations.',
    'Immediate issuance of ration card, action against corrupt officials',
    'Application pending since February 2025',
    'Hindi', '2025-02-15', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
);


-- Matches: link cases to providers

INSERT INTO matches (case_id, citizen_id, provider_id, match_score, status, internal_status, provider_notes, created_at) VALUES (
    (SELECT id FROM cases WHERE petitioner_name='Sunita Devi' AND case_type='Family Law' LIMIT 1),
    (SELECT id FROM users WHERE email='sunita.devi@gmail.com'),
    (SELECT id FROM users WHERE email='sneha.kulkarni@lawfirm.in'),
    0.95, 'ACCEPTED', 'Active',
    'High priority DV case. Client needs immediate protection order. Court date to be filed this week.',
    NOW() - INTERVAL '4 days'
);

INSERT INTO matches (case_id, citizen_id, provider_id, match_score, status, internal_status, provider_notes, created_at) VALUES (
    (SELECT id FROM cases WHERE petitioner_name='Sunita Devi' AND case_type='Family Law' LIMIT 1),
    (SELECT id FROM users WHERE email='sunita.devi@gmail.com'),
    (SELECT id FROM users WHERE email='contact@majlislaw.com'),
    0.92, 'ACCEPTED', 'Counselling Started',
    'Referred client for counselling. Shelter home arranged. Will assist Adv. Sneha with legal documentation.',
    NOW() - INTERVAL '4 days'
);

INSERT INTO matches (case_id, citizen_id, provider_id, match_score, status, internal_status, provider_notes, created_at) VALUES (
    (SELECT id FROM cases WHERE petitioner_name='Amit Verma' AND case_type='Property Disputes' LIMIT 1),
    (SELECT id FROM users WHERE email='amit.verma@gmail.com'),
    (SELECT id FROM users WHERE email='deepak.verma@lawfirm.in'),
    0.88, 'ACCEPTED', 'Document Review',
    'Verified original will. Strong case. Filing suit for possession and injunction next week.',
    NOW() - INTERVAL '9 days'
);

INSERT INTO matches (case_id, citizen_id, provider_id, match_score, status, internal_status, created_at) VALUES (
    (SELECT id FROM cases WHERE petitioner_name='Mohammad Irfan' AND case_type='Criminal' LIMIT 1),
    (SELECT id FROM users WHERE email='mohammad.irfan@gmail.com'),
    (SELECT id FROM users WHERE email='rohit.saxena@lawfirm.in'),
    0.91, 'PENDING', 'Reviewing',
    NOW() - INTERVAL '6 days'
);

INSERT INTO matches (case_id, citizen_id, provider_id, match_score, status, internal_status, created_at) VALUES (
    (SELECT id FROM cases WHERE petitioner_name='Mohammad Irfan' AND case_type='Criminal' LIMIT 1),
    (SELECT id FROM users WHERE email='mohammad.irfan@gmail.com'),
    (SELECT id FROM users WHERE email='probono@dlsa.gov.in'),
    0.87, 'PENDING', 'Reviewing',
    NOW() - INTERVAL '6 days'
);

INSERT INTO matches (case_id, citizen_id, provider_id, match_score, status, internal_status, provider_notes, created_at) VALUES (
    (SELECT id FROM cases WHERE petitioner_name='Rajendra Singh' AND case_type='Labour & Employment' LIMIT 1),
    (SELECT id FROM users WHERE email='rajendra.singh@gmail.com'),
    (SELECT id FROM users WHERE email='sunil.patil@lawfirm.in'),
    0.85, 'ACCEPTED', 'Notice Sent',
    'Legal notice sent to employer on April 2. Awaiting response within 15 days. Strong case under Industrial Disputes Act.',
    NOW() - INTERVAL '11 days'
);

INSERT INTO matches (case_id, citizen_id, provider_id, match_score, status, internal_status, provider_notes, created_at) VALUES (
    (SELECT id FROM cases WHERE petitioner_name='Rajendra Singh' AND case_type='Labour & Employment' LIMIT 1),
    (SELECT id FROM users WHERE email='rajendra.singh@gmail.com'),
    (SELECT id FROM users WHERE email='legal@pratham.org'),
    0.83, 'ACCEPTED', 'Documentation',
    'Helping client gather employment proof documents, PF passbook, salary slips.',
    NOW() - INTERVAL '11 days'
);

INSERT INTO matches (case_id, citizen_id, provider_id, match_score, status, internal_status, created_at) VALUES (
    (SELECT id FROM cases WHERE petitioner_name='Deepa Krishnan' AND case_type='Environmental Law' LIMIT 1),
    (SELECT id FROM users WHERE email='deepa.krishnan@gmail.com'),
    (SELECT id FROM users WHERE email='pooja.iyengar@lawfirm.in'),
    0.93, 'PENDING', 'Reviewing',
    NOW() - INTERVAL '2 days'
);

INSERT INTO matches (case_id, citizen_id, provider_id, match_score, status, internal_status, provider_notes, created_at) VALUES (
    (SELECT id FROM cases WHERE petitioner_name='Lakshmi Menon' AND case_type='Consumer Protection' LIMIT 1),
    (SELECT id FROM users WHERE email='lakshmi.menon@gmail.com'),
    (SELECT id FROM users WHERE email='revathi.sub@lawfirm.in'),
    0.86, 'ACCEPTED', 'Case Filed',
    'Consumer complaint filed before DCDRF Chennai. Next hearing on April 20, 2026.',
    NOW() - INTERVAL '7 days'
);

INSERT INTO matches (case_id, citizen_id, provider_id, match_score, status, internal_status, provider_notes, created_at) VALUES (
    (SELECT id FROM cases WHERE petitioner_name='Rahul Sharma' AND case_type='Human Rights' LIMIT 1),
    (SELECT id FROM users WHERE email='rahul.sharma@gmail.com'),
    (SELECT id FROM users WHERE email='arjun.kapoor@lawfirm.in'),
    0.96, 'ACCEPTED', 'Urgent Filing',
    'Filed urgent PIL in Delhi High Court. Stay granted on demolition. Next hearing April 14.',
    NOW() - INTERVAL '5 days'
);

INSERT INTO matches (case_id, citizen_id, provider_id, match_score, status, internal_status, provider_notes, created_at) VALUES (
    (SELECT id FROM cases WHERE petitioner_name='Rahul Sharma' AND case_type='Human Rights' LIMIT 1),
    (SELECT id FROM users WHERE email='rahul.sharma@gmail.com'),
    (SELECT id FROM users WHERE email='delhi@chri.org'),
    0.90, 'ACCEPTED', 'Survey Initiated',
    'Conducting ground survey with community. Documenting 200 families for rehabilitation plan. Coordinating with Adv. Arjun Kapoor.',
    NOW() - INTERVAL '5 days'
);

INSERT INTO matches (case_id, citizen_id, provider_id, match_score, status, internal_status, created_at) VALUES (
    (SELECT id FROM cases WHERE petitioner_name='Priya Patel' AND case_type='Intellectual Property' LIMIT 1),
    (SELECT id FROM users WHERE email='priya.patel@gmail.com'),
    (SELECT id FROM users WHERE email='vikram.desai@lawfirm.in'),
    0.89, 'PENDING', 'Reviewing',
    NOW() - INTERVAL '3 days'
);


-- Appointments

INSERT INTO appointments (match_id, created_by_id, title, description, appointment_date, location, status, created_at, updated_at) VALUES (
    (SELECT m.id FROM matches m JOIN users u ON m.provider_id=u.id WHERE u.email='sneha.kulkarni@lawfirm.in' AND m.status='ACCEPTED' LIMIT 1),
    (SELECT id FROM users WHERE email='sneha.kulkarni@lawfirm.in'),
    'Initial Case Discussion',
    'Discuss protection order filing strategy and custody petition. Client to bring marriage certificate, children birth certificates.',
    NOW() + INTERVAL '2 days',
    'Office 12, Jolly Maker Apt, Cuffe Parade, Mumbai',
    'SCHEDULED',
    NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
);

INSERT INTO appointments (match_id, created_by_id, title, description, appointment_date, location, status, created_at, updated_at) VALUES (
    (SELECT m.id FROM matches m JOIN users u ON m.provider_id=u.id WHERE u.email='deepak.verma@lawfirm.in' AND m.status='ACCEPTED' LIMIT 1),
    (SELECT id FROM users WHERE email='deepak.verma@lawfirm.in'),
    'Document Verification Meeting',
    'Review original will, property documents, and forged documents. Prepare for filing possession suit.',
    NOW() + INTERVAL '3 days',
    '204, Janpath Lane, Connaught Place, New Delhi',
    'SCHEDULED',
    NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'
);

INSERT INTO appointments (match_id, created_by_id, title, description, appointment_date, location, status, created_at, updated_at) VALUES (
    (SELECT m.id FROM matches m JOIN users u ON m.provider_id=u.id WHERE u.email='arjun.kapoor@lawfirm.in' AND m.status='ACCEPTED' LIMIT 1),
    (SELECT id FROM users WHERE email='arjun.kapoor@lawfirm.in'),
    'PIL Filing Discussion',
    'Discussed strategy for PIL filing. Stay application prepared. Survey report from CHRI to be attached.',
    NOW() - INTERVAL '3 days',
    'Chamber 42, Supreme Court Bar Association, New Delhi',
    'COMPLETED',
    NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'
);

INSERT INTO appointments (match_id, created_by_id, title, description, appointment_date, location, status, created_at, updated_at) VALUES (
    (SELECT m.id FROM matches m JOIN users u ON m.provider_id=u.id WHERE u.email='revathi.sub@lawfirm.in' AND m.status='ACCEPTED' LIMIT 1),
    (SELECT id FROM users WHERE email='revathi.sub@lawfirm.in'),
    'Court Hearing Preparation',
    'Prepare arguments for first hearing before DCDRF. Bring all payment receipts, agreement copy, and builder correspondence.',
    NOW() + INTERVAL '5 days',
    '32, Nungambakkam High Road, Chennai',
    'SCHEDULED',
    NOW(), NOW()
);

INSERT INTO appointments (match_id, created_by_id, title, description, appointment_date, location, status, created_at, updated_at) VALUES (
    (SELECT m.id FROM matches m JOIN users u ON m.provider_id=u.id WHERE u.email='sunil.patil@lawfirm.in' AND m.status='ACCEPTED' LIMIT 1),
    (SELECT id FROM users WHERE email='sunil.patil@lawfirm.in'),
    'Labour Court Filing',
    'File complaint at Labour Court. Client to bring salary account statements and any communication from employer.',
    NOW() + INTERVAL '4 days',
    '201, B Wing, Trade Centre, Bandra Kurla Complex, Mumbai',
    'SCHEDULED',
    NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
);


-- Notifications

INSERT INTO notifications (user_id, title, message, type, read, created_at) VALUES
((SELECT id FROM users WHERE email='sunita.devi@gmail.com'), 'Case Matched!', 'Your domestic violence case has been matched with Adv. Sneha Kulkarni (95% match). Check your matches page.', 'MATCH', false, NOW() - INTERVAL '4 days'),
((SELECT id FROM users WHERE email='sunita.devi@gmail.com'), 'NGO Support Assigned', 'Majlis Legal Centre has been assigned to provide counselling support for your case.', 'MATCH', false, NOW() - INTERVAL '4 days'),
((SELECT id FROM users WHERE email='sunita.devi@gmail.com'), 'Appointment Scheduled', 'Adv. Sneha Kulkarni has scheduled a consultation for case discussion.', 'APPOINTMENT', false, NOW() - INTERVAL '1 day'),

((SELECT id FROM users WHERE email='amit.verma@gmail.com'), 'Case Matched!', 'Your property dispute case has been matched with Adv. Deepak Verma (88% match).', 'MATCH', true, NOW() - INTERVAL '9 days'),
((SELECT id FROM users WHERE email='amit.verma@gmail.com'), 'Appointment Scheduled', 'Document verification meeting scheduled with Adv. Deepak Verma.', 'APPOINTMENT', false, NOW() - INTERVAL '2 days'),

((SELECT id FROM users WHERE email='rahul.sharma@gmail.com'), 'Urgent: Case Accepted', 'Adv. Arjun Kapoor has accepted your human rights case. PIL filing initiated.', 'MATCH', true, NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE email='rahul.sharma@gmail.com'), 'Stay Granted!', 'Delhi High Court has granted stay on demolition. Next hearing on April 14.', 'CASE_UPDATE', false, NOW() - INTERVAL '3 days'),
((SELECT id FROM users WHERE email='rahul.sharma@gmail.com'), 'NGO Support', 'Commonwealth Human Rights Initiative is conducting ground survey for your case.', 'MATCH', false, NOW() - INTERVAL '5 days'),

((SELECT id FROM users WHERE email='lakshmi.menon@gmail.com'), 'Case Matched!', 'Your consumer complaint has been matched with Adv. Revathi Subramanian.', 'MATCH', true, NOW() - INTERVAL '7 days'),
((SELECT id FROM users WHERE email='lakshmi.menon@gmail.com'), 'Case Filed', 'Consumer complaint filed before DCDRF Chennai. Hearing on April 20.', 'CASE_UPDATE', false, NOW() - INTERVAL '5 days'),

((SELECT id FROM users WHERE email='rajendra.singh@gmail.com'), 'Case Matched!', 'Your labour dispute case has been matched with Adv. Sunil Patil and Pratham Legal Aid.', 'MATCH', true, NOW() - INTERVAL '11 days'),
((SELECT id FROM users WHERE email='rajendra.singh@gmail.com'), 'Legal Notice Sent', 'Adv. Sunil Patil has sent legal notice to SecureWatch Services. Awaiting response.', 'CASE_UPDATE', false, NOW() - INTERVAL '5 days'),

((SELECT id FROM users WHERE email='sneha.kulkarni@lawfirm.in'), 'New Case Assigned', 'Domestic violence case from Sunita Devi. High urgency - protection order needed.', 'MATCH', true, NOW() - INTERVAL '4 days'),
((SELECT id FROM users WHERE email='arjun.kapoor@lawfirm.in'), 'New Case Assigned', 'Forced eviction / Human Rights case from Rahul Sharma. 200 families affected.', 'MATCH', true, NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE email='arjun.kapoor@lawfirm.in'), 'Court Order Update', 'Stay granted by Delhi HC on Yamuna Pushta demolition. Order copy uploaded.', 'CASE_UPDATE', false, NOW() - INTERVAL '3 days'),
((SELECT id FROM users WHERE email='deepak.verma@lawfirm.in'), 'New Case Assigned', 'Property dispute case from Amit Verma. Ancestral property in Chandni Chowk.', 'MATCH', true, NOW() - INTERVAL '9 days'),
((SELECT id FROM users WHERE email='rohit.saxena@lawfirm.in'), 'New Case Request', 'False theft accusation case from Mohammad Irfan. Review and accept/decline.', 'MATCH', false, NOW() - INTERVAL '6 days'),
((SELECT id FROM users WHERE email='sunil.patil@lawfirm.in'), 'New Case Assigned', 'Labour dispute case from Rajendra Singh. Illegal termination claim.', 'MATCH', true, NOW() - INTERVAL '11 days'),
((SELECT id FROM users WHERE email='revathi.sub@lawfirm.in'), 'New Case Assigned', 'Consumer complaint from Lakshmi Menon against SkyHigh Builders.', 'MATCH', true, NOW() - INTERVAL '7 days'),
((SELECT id FROM users WHERE email='vikram.desai@lawfirm.in'), 'New Case Request', 'IP theft case from Priya Patel. Copyright infringement by competitor.', 'MATCH', false, NOW() - INTERVAL '3 days'),

((SELECT id FROM users WHERE email='contact@majlislaw.com'), 'Support Case Assigned', 'DV case support needed for Sunita Devi. Coordinate with Adv. Sneha Kulkarni.', 'MATCH', true, NOW() - INTERVAL '4 days'),
((SELECT id FROM users WHERE email='delhi@chri.org'), 'Survey Case Assigned', 'Yamuna Pushta eviction case. Conduct ground survey for 200 families.', 'MATCH', true, NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE email='legal@pratham.org'), 'Documentation Support', 'Labour dispute case. Help Rajendra Singh gather employment proof documents.', 'MATCH', true, NOW() - INTERVAL '11 days'),
((SELECT id FROM users WHERE email='probono@dlsa.gov.in'), 'Pro Bono Case Referral', 'False FIR case from Mohammad Irfan. Review for pro bono legal aid.', 'MATCH', false, NOW() - INTERVAL '6 days');


-- Chat messages

INSERT INTO messages (match_id, sender_id, receiver_id, content, created_at) VALUES
((SELECT m.id FROM matches m JOIN users u ON m.provider_id=u.id WHERE u.email='sneha.kulkarni@lawfirm.in' AND m.status='ACCEPTED' LIMIT 1), (SELECT id FROM users WHERE email='sunita.devi@gmail.com'), (SELECT id FROM users WHERE email='sneha.kulkarni@lawfirm.in'), 'Namaste madam, I submitted my case about domestic violence. Please help me.', NOW() - INTERVAL '4 days'),
((SELECT m.id FROM matches m JOIN users u ON m.provider_id=u.id WHERE u.email='sneha.kulkarni@lawfirm.in' AND m.status='ACCEPTED' LIMIT 1), (SELECT id FROM users WHERE email='sneha.kulkarni@lawfirm.in'), (SELECT id FROM users WHERE email='sunita.devi@gmail.com'), 'Namaste Sunita ji. I have reviewed your case. First we need to file a protection order. Can you bring your marriage certificate?', NOW() - INTERVAL '4 days' + INTERVAL '2 hours'),
((SELECT m.id FROM matches m JOIN users u ON m.provider_id=u.id WHERE u.email='sneha.kulkarni@lawfirm.in' AND m.status='ACCEPTED' LIMIT 1), (SELECT id FROM users WHERE email='sunita.devi@gmail.com'), (SELECT id FROM users WHERE email='sneha.kulkarni@lawfirm.in'), 'Ji madam, I have all documents. But I am scared to come alone. My husband watches me.', NOW() - INTERVAL '3 days'),
((SELECT m.id FROM matches m JOIN users u ON m.provider_id=u.id WHERE u.email='sneha.kulkarni@lawfirm.in' AND m.status='ACCEPTED' LIMIT 1), (SELECT id FROM users WHERE email='sneha.kulkarni@lawfirm.in'), (SELECT id FROM users WHERE email='sunita.devi@gmail.com'), 'Do not worry. Majlis Legal Centre counsellor will accompany you. I scheduled an appointment.', NOW() - INTERVAL '3 days' + INTERVAL '1 hour'),

((SELECT m.id FROM matches m JOIN users u ON m.provider_id=u.id WHERE u.email='arjun.kapoor@lawfirm.in' AND m.status='ACCEPTED' LIMIT 1), (SELECT id FROM users WHERE email='rahul.sharma@gmail.com'), (SELECT id FROM users WHERE email='arjun.kapoor@lawfirm.in'), 'Sir, the bulldozers may come any day. 200 families have nowhere to go.', NOW() - INTERVAL '5 days'),
((SELECT m.id FROM matches m JOIN users u ON m.provider_id=u.id WHERE u.email='arjun.kapoor@lawfirm.in' AND m.status='ACCEPTED' LIMIT 1), (SELECT id FROM users WHERE email='arjun.kapoor@lawfirm.in'), (SELECT id FROM users WHERE email='rahul.sharma@gmail.com'), 'Rahul, I filed an urgent PIL in Delhi High Court citing Sudama Singh judgment.', NOW() - INTERVAL '5 days' + INTERVAL '3 hours'),
((SELECT m.id FROM matches m JOIN users u ON m.provider_id=u.id WHERE u.email='arjun.kapoor@lawfirm.in' AND m.status='ACCEPTED' LIMIT 1), (SELECT id FROM users WHERE email='arjun.kapoor@lawfirm.in'), (SELECT id FROM users WHERE email='rahul.sharma@gmail.com'), 'Good news! Delhi HC granted stay on demolition until next hearing April 14.', NOW() - INTERVAL '3 days'),
((SELECT m.id FROM matches m JOIN users u ON m.provider_id=u.id WHERE u.email='arjun.kapoor@lawfirm.in' AND m.status='ACCEPTED' LIMIT 1), (SELECT id FROM users WHERE email='rahul.sharma@gmail.com'), (SELECT id FROM users WHERE email='arjun.kapoor@lawfirm.in'), 'Thank you so much sir! Everyone is relieved. CHRI team also came for the survey.', NOW() - INTERVAL '2 days'),

((SELECT m.id FROM matches m JOIN users u ON m.provider_id=u.id WHERE u.email='deepak.verma@lawfirm.in' AND m.status='ACCEPTED' LIMIT 1), (SELECT id FROM users WHERE email='amit.verma@gmail.com'), (SELECT id FROM users WHERE email='deepak.verma@lawfirm.in'), 'Sir, I have the original registered will from my grandfather.', NOW() - INTERVAL '8 days'),
((SELECT m.id FROM matches m JOIN users u ON m.provider_id=u.id WHERE u.email='deepak.verma@lawfirm.in' AND m.status='ACCEPTED' LIMIT 1), (SELECT id FROM users WHERE email='deepak.verma@lawfirm.in'), (SELECT id FROM users WHERE email='amit.verma@gmail.com'), 'Amit, your grandfather will is the last registered document. Any newer will is suspect.', NOW() - INTERVAL '7 days'),

((SELECT m.id FROM matches m JOIN users u ON m.provider_id=u.id WHERE u.email='revathi.sub@lawfirm.in' AND m.status='ACCEPTED' LIMIT 1), (SELECT id FROM users WHERE email='lakshmi.menon@gmail.com'), (SELECT id FROM users WHERE email='revathi.sub@lawfirm.in'), 'Madam, the builder is threatening to cancel my booking if I do not pay extra 5 lakhs.', NOW() - INTERVAL '6 days'),
((SELECT m.id FROM matches m JOIN users u ON m.provider_id=u.id WHERE u.email='revathi.sub@lawfirm.in' AND m.status='ACCEPTED' LIMIT 1), (SELECT id FROM users WHERE email='revathi.sub@lawfirm.in'), (SELECT id FROM users WHERE email='lakshmi.menon@gmail.com'), 'Do not pay anything extra. The escalation clause is void under RERA. Hearing is April 20.', NOW() - INTERVAL '6 days' + INTERVAL '1 hour');
