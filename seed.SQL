-- ============================================================
--  MEDIGRID — SEED DATA
--  Run AFTER schema.sql
-- ============================================================

-- ============================================================
-- DISTRICTS
-- ============================================================
INSERT INTO districts (id, name, state) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Central District', 'Maharashtra'),
  ('d1000000-0000-0000-0000-000000000002', 'North District',   'Maharashtra'),
  ('d1000000-0000-0000-0000-000000000003', 'South District',   'Maharashtra');

-- ============================================================
-- HOSPITALS
-- ============================================================
INSERT INTO hospitals (id, district_id, name, type, address, latitude, longitude, phone, email, status) VALUES
  ('h1000000-0000-0000-0000-000000000001',
   'd1000000-0000-0000-0000-000000000001',
   'Metro North Govt. Hospital','tertiary',
   '1, MG Road, Central District','19.0760','72.8777','022-2456-7890','admin@metronorth.gov.in','active'),

  ('h1000000-0000-0000-0000-000000000002',
   'd1000000-0000-0000-0000-000000000001',
   'City General Hospital','secondary',
   '45, Ring Road, Central District','19.0820','72.8850','022-2456-1234','admin@citygeneral.gov.in','active'),

  ('h1000000-0000-0000-0000-000000000003',
   'd1000000-0000-0000-0000-000000000001',
   'ESI Hospital (Central)','esi',
   '12, ESI Colony, Central District','19.0700','72.8920','022-2456-5678','admin@esi-central.gov.in','active'),

  ('h1000000-0000-0000-0000-000000000004',
   'd1000000-0000-0000-0000-000000000002',
   'District Medical College','teaching',
   '1, University Road, North District','19.0900','72.8600','022-2456-9012','admin@dmc.gov.in','active'),

  ('h1000000-0000-0000-0000-000000000005',
   'd1000000-0000-0000-0000-000000000002',
   'Apollo District Hospital','govt_aided',
   '88, Apollo Marg, North District','19.0950','72.8700','022-2456-3456','admin@apollodistrict.gov.in','active'),

  ('h1000000-0000-0000-0000-000000000006',
   'd1000000-0000-0000-0000-000000000001',
   'District Trauma Centre','trauma',
   '5, Trauma Highway, Central District','19.0680','72.8800','022-2456-7777','admin@traumacentre.gov.in','active'),

  ('h1000000-0000-0000-0000-000000000007',
   'd1000000-0000-0000-0000-000000000003',
   'Community Health Centre #3','primary',
   'Ward 7, South District','19.0600','72.8650','022-2456-1111','admin@chc3.gov.in','active'),

  ('h1000000-0000-0000-0000-000000000008',
   'd1000000-0000-0000-0000-000000000001',
   'Railway Hospital (Div.)','railway',
   'Railway Colony, Central District','19.0780','72.8730','022-2456-2222','admin@railwayhospital.gov.in','active');

-- ============================================================
-- DEPARTMENTS
-- ============================================================
-- Metro North
INSERT INTO departments (id, hospital_id, type, name, total_beds, floor_number) VALUES
  ('dep00001-0000-0000-0000-000000000001','h1000000-0000-0000-0000-000000000001','icu',    'Intensive Care Unit',      20, 3),
  ('dep00001-0000-0000-0000-000000000002','h1000000-0000-0000-0000-000000000001','nicu',   'Neonatal ICU',              8, 3),
  ('dep00001-0000-0000-0000-000000000003','h1000000-0000-0000-0000-000000000001','women',  'Women & Maternity',        20, 2),
  ('dep00001-0000-0000-0000-000000000004','h1000000-0000-0000-0000-000000000001','general','General Ward',            120, 1),
  ('dep00001-0000-0000-0000-000000000005','h1000000-0000-0000-0000-000000000001','child',  'Paediatric Department',    30, 2),
  ('dep00001-0000-0000-0000-000000000006','h1000000-0000-0000-0000-000000000001','deluxe', 'Deluxe / Private Rooms',  10, 4);

-- City General
INSERT INTO departments (id, hospital_id, type, name, total_beds, floor_number) VALUES
  ('dep00002-0000-0000-0000-000000000001','h1000000-0000-0000-0000-000000000002','icu',    'ICU',                12, 2),
  ('dep00002-0000-0000-0000-000000000002','h1000000-0000-0000-0000-000000000002','nicu',   'NICU',                4, 2),
  ('dep00002-0000-0000-0000-000000000003','h1000000-0000-0000-0000-000000000002','women',  'Women & Maternity',  18, 1),
  ('dep00002-0000-0000-0000-000000000004','h1000000-0000-0000-0000-000000000002','general','General Ward',       80, 1),
  ('dep00002-0000-0000-0000-000000000005','h1000000-0000-0000-0000-000000000002','child',  'Paediatric',         15, 2),
  ('dep00002-0000-0000-0000-000000000006','h1000000-0000-0000-0000-000000000002','deluxe', 'Deluxe Rooms',        5, 3);

-- ESI Hospital
INSERT INTO departments (id, hospital_id, type, name, total_beds, floor_number) VALUES
  ('dep00003-0000-0000-0000-000000000001','h1000000-0000-0000-0000-000000000003','icu',    'ICU',                10, 3),
  ('dep00003-0000-0000-0000-000000000002','h1000000-0000-0000-0000-000000000003','nicu',   'NICU',                6, 3),
  ('dep00003-0000-0000-0000-000000000003','h1000000-0000-0000-0000-000000000003','women',  'Women & Maternity',  15, 2),
  ('dep00003-0000-0000-0000-000000000004','h1000000-0000-0000-0000-000000000003','general','General Ward',       90, 1),
  ('dep00003-0000-0000-0000-000000000005','h1000000-0000-0000-0000-000000000003','child',  'Paediatric',         20, 2),
  ('dep00003-0000-0000-0000-000000000006','h1000000-0000-0000-0000-000000000003','deluxe', 'Deluxe Rooms',        6, 4);

-- District Medical College
INSERT INTO departments (id, hospital_id, type, name, total_beds, floor_number) VALUES
  ('dep00004-0000-0000-0000-000000000001','h1000000-0000-0000-0000-000000000004','icu',    'ICU',               30, 4),
  ('dep00004-0000-0000-0000-000000000002','h1000000-0000-0000-0000-000000000004','nicu',   'NICU',              10, 4),
  ('dep00004-0000-0000-0000-000000000003','h1000000-0000-0000-0000-000000000004','women',  'Women & Maternity', 30, 2),
  ('dep00004-0000-0000-0000-000000000004','h1000000-0000-0000-0000-000000000004','general','General Ward',     200, 1),
  ('dep00004-0000-0000-0000-000000000005','h1000000-0000-0000-0000-000000000004','child',  'Paediatric',        40, 3),
  ('dep00004-0000-0000-0000-000000000006','h1000000-0000-0000-0000-000000000004','deluxe', 'Deluxe Rooms',       8, 5);

-- ============================================================
-- BEDS — Metro North ICU (20 beds, 8 available)
-- ============================================================
DO $$
DECLARE i INT;
BEGIN
  FOR i IN 1..20 LOOP
    INSERT INTO beds (hospital_id, department_id, bed_code, status) VALUES (
      'h1000000-0000-0000-0000-000000000001',
      'dep00001-0000-0000-0000-000000000001',
      'ICU-' || LPAD(i::TEXT, 2, '0'),
      CASE WHEN i <= 8 THEN 'available' WHEN i = 9 THEN 'maintenance' ELSE 'occupied' END
    );
  END LOOP;
END$$;

-- Metro North NICU (8 beds, 4 available)
DO $$
DECLARE i INT;
BEGIN
  FOR i IN 1..8 LOOP
    INSERT INTO beds (hospital_id, department_id, bed_code, status) VALUES (
      'h1000000-0000-0000-0000-000000000001',
      'dep00001-0000-0000-0000-000000000002',
      'NICU-' || LPAD(i::TEXT, 2, '0'),
      CASE WHEN i <= 4 THEN 'available' ELSE 'occupied' END
    );
  END LOOP;
END$$;

-- Metro North General (120 beds, 42 available)
DO $$
DECLARE i INT;
BEGIN
  FOR i IN 1..120 LOOP
    INSERT INTO beds (hospital_id, department_id, bed_code, status) VALUES (
      'h1000000-0000-0000-0000-000000000001',
      'dep00001-0000-0000-0000-000000000004',
      'GEN-' || LPAD(i::TEXT, 3, '0'),
      CASE WHEN i <= 42 THEN 'available' WHEN i IN (43,44,45) THEN 'maintenance' ELSE 'occupied' END
    );
  END LOOP;
END$$;

-- City General ICU (12 beds, 1 available - CRITICAL)
DO $$
DECLARE i INT;
BEGIN
  FOR i IN 1..12 LOOP
    INSERT INTO beds (hospital_id, department_id, bed_code, status) VALUES (
      'h1000000-0000-0000-0000-000000000002',
      'dep00002-0000-0000-0000-000000000001',
      'ICU-' || LPAD(i::TEXT, 2, '0'),
      CASE WHEN i = 1 THEN 'available' ELSE 'occupied' END
    );
  END LOOP;
END$$;

-- ============================================================
-- BLOOD BANKS
-- ============================================================
INSERT INTO blood_banks (id, hospital_id, name, phone) VALUES
  ('bb000001-0000-0000-0000-000000000001','h1000000-0000-0000-0000-000000000001','Metro North Blood Bank','022-2456-7891'),
  ('bb000001-0000-0000-0000-000000000002','h1000000-0000-0000-0000-000000000002','City General Blood Bank','022-2456-1235'),
  ('bb000001-0000-0000-0000-000000000003','h1000000-0000-0000-0000-000000000003','ESI Blood Bank','022-2456-5679'),
  ('bb000001-0000-0000-0000-000000000004','h1000000-0000-0000-0000-000000000004','District Medical Blood Bank','022-2456-9013');

-- ============================================================
-- BLOOD INVENTORY
-- ============================================================
INSERT INTO blood_inventory (blood_bank_id, blood_type, units, capacity) VALUES
-- Metro North
  ('bb000001-0000-0000-0000-000000000001','A+',  30, 60),
  ('bb000001-0000-0000-0000-000000000001','A-',   6, 30),
  ('bb000001-0000-0000-0000-000000000001','B+',  36, 60),
  ('bb000001-0000-0000-0000-000000000001','B-',   4, 30),
  ('bb000001-0000-0000-0000-000000000001','O+',  45, 80),
  ('bb000001-0000-0000-0000-000000000001','O-',   2, 30),
  ('bb000001-0000-0000-0000-000000000001','AB+', 20, 40),
  ('bb000001-0000-0000-0000-000000000001','AB-', 15, 25),
-- City General
  ('bb000001-0000-0000-0000-000000000002','A+',  18, 40),
  ('bb000001-0000-0000-0000-000000000002','A-',   2, 20),
  ('bb000001-0000-0000-0000-000000000002','B+',  20, 40),
  ('bb000001-0000-0000-0000-000000000002','B-',   2, 20),
  ('bb000001-0000-0000-0000-000000000002','O+',  25, 50),
  ('bb000001-0000-0000-0000-000000000002','O-',   0, 20),
  ('bb000001-0000-0000-0000-000000000002','AB+', 12, 25),
  ('bb000001-0000-0000-0000-000000000002','AB-',  8, 15),
-- ESI
  ('bb000001-0000-0000-0000-000000000003','A+',  24, 50),
  ('bb000001-0000-0000-0000-000000000003','A-',   4, 20),
  ('bb000001-0000-0000-0000-000000000003','B+',  28, 50),
  ('bb000001-0000-0000-0000-000000000003','B-',   2, 20),
  ('bb000001-0000-0000-0000-000000000003','O+',  40, 60),
  ('bb000001-0000-0000-0000-000000000003','O-',   0, 20),
  ('bb000001-0000-0000-0000-000000000003','AB+', 18, 30),
  ('bb000001-0000-0000-0000-000000000003','AB-', 10, 15),
-- District Medical
  ('bb000001-0000-0000-0000-000000000004','A+',  12, 30),
  ('bb000001-0000-0000-0000-000000000004','A-',   0, 15),
  ('bb000001-0000-0000-0000-000000000004','B+',  12, 30),
  ('bb000001-0000-0000-0000-000000000004','B-',   0, 15),
  ('bb000001-0000-0000-0000-000000000004','O+',  10, 40),
  ('bb000001-0000-0000-0000-000000000004','O-',   0, 15),
  ('bb000001-0000-0000-0000-000000000004','AB+',  5, 20),
  ('bb000001-0000-0000-0000-000000000004','AB-',  2, 10);

-- ============================================================
-- AMBULANCES
-- ============================================================
INSERT INTO ambulances (id, hospital_id, unit_code, vehicle_reg, type, status, driver_name, driver_phone) VALUES
  ('am000001-0000-0000-0000-000000000001','h1000000-0000-0000-0000-000000000001','AMB-01','MH-01-AB-1234','cardiac',   'en_route', 'Ramesh Patil',  '9876543210'),
  ('am000001-0000-0000-0000-000000000001','h1000000-0000-0000-0000-000000000001','AMB-02','MH-01-AB-1235','als',       'available','Suresh Kumar',  '9876543211'),
  ('am000001-0000-0000-0000-000000000002','h1000000-0000-0000-0000-000000000002','AMB-03','MH-01-AB-1236','als',       'available','Dinesh Rao',    '9876543212'),
  ('am000001-0000-0000-0000-000000000002','h1000000-0000-0000-0000-000000000002','AMB-04','MH-01-AB-1237','bls',       'en_route', 'Mahesh Singh',  '9876543213'),
  ('am000001-0000-0000-0000-000000000003','h1000000-0000-0000-0000-000000000003','AMB-05','MH-01-AB-1238','als',       'en_route', 'Ganesh Sharma', '9876543214'),
  ('am000001-0000-0000-0000-000000000003','h1000000-0000-0000-0000-000000000003','AMB-06','MH-01-AB-1239','neonatal',  'available','Rakesh Verma',  '9876543215'),
  ('am000001-0000-0000-0000-000000000004','h1000000-0000-0000-0000-000000000004','AMB-07','MH-01-AB-1240','als',       'en_route', 'Vijay Mehta',   '9876543216'),
  ('am000001-0000-0000-0000-000000000004','h1000000-0000-0000-0000-000000000004','AMB-08','MH-01-AB-1241','bls',       'maintenance','Anil Joshi',   '9876543217'),
  ('am000001-0000-0000-0000-000000000005','h1000000-0000-0000-0000-000000000005','AMB-09','MH-01-AB-1242','als',       'available','Sanjay Tiwari', '9876543218');

-- ============================================================
-- SAMPLE PATIENTS + DISPATCH RECORDS
-- ============================================================
INSERT INTO patients (id, name, age, gender, phone, pickup_address, condition, priority) VALUES
  ('pa000001-0000-0000-0000-000000000001','Rajesh Kumar',    58,'M','9876500001','14-B MG Road, Near State Bank',  'Cardiac Arrest',    'P1'),
  ('pa000001-0000-0000-0000-000000000002','Sunita Sharma',   34,'F','9876500002','45, Ring Road Market',           'Respiratory Distress','P2'),
  ('pa000001-0000-0000-0000-000000000003','Arjun Mehta',      8,'M','9876500003','School Road, Near Park',         'Seizure',           'P1'),
  ('pa000001-0000-0000-0000-000000000004','Kavita Patel',    29,'F','9876500004','12, Shastri Nagar',              'Labour — Emergency','P1'),
  ('pa000001-0000-0000-0000-000000000005','Mohammed Khan',   67,'M','9876500005','3rd Floor, Sadar Bazaar',        'Stroke',            'P1');

INSERT INTO dispatch_records (patient_id, ambulance_id, hospital_id, status, dispatched_at, en_route_at, on_scene_at, distance_km) VALUES
  ('pa000001-0000-0000-0000-000000000001','am000001-0000-0000-0000-000000000001','h1000000-0000-0000-0000-000000000001','en_route',   NOW()-INTERVAL'8 min', NOW()-INTERVAL'7 min', NULL, 3.2),
  ('pa000001-0000-0000-0000-000000000002','am000001-0000-0000-0000-000000000002','h1000000-0000-0000-0000-000000000002','on_scene',   NOW()-INTERVAL'20 min',NOW()-INTERVAL'18 min',NOW()-INTERVAL'12 min',2.8),
  ('pa000001-0000-0000-0000-000000000003','am000001-0000-0000-0000-000000000004','h1000000-0000-0000-0000-000000000001','transporting',NOW()-INTERVAL'35 min',NOW()-INTERVAL'33 min',NOW()-INTERVAL'25 min',4.1),
  ('pa000001-0000-0000-0000-000000000004','am000001-0000-0000-0000-000000000005','h1000000-0000-0000-0000-000000000003','completed',  NOW()-INTERVAL'2 hr',  NOW()-INTERVAL'115 min',NOW()-INTERVAL'108 min',1.9),
  ('pa000001-0000-0000-0000-000000000005','am000001-0000-0000-0000-000000000007','h1000000-0000-0000-0000-000000000004','en_route',   NOW()-INTERVAL'5 min', NOW()-INTERVAL'4 min', NULL, 5.5);

-- ============================================================
-- ADMIN USERS
-- ============================================================
INSERT INTO admin_users (hospital_id, name, email, role) VALUES
  (NULL,                                         'District Admin',          'superadmin@medigrid.gov.in',     'super_admin'),
  ('h1000000-0000-0000-0000-000000000001',       'Metro North Admin',       'admin@metronorth.gov.in',        'hospital_admin'),
  ('h1000000-0000-0000-0000-000000000002',       'City General Admin',      'admin@citygeneral.gov.in',       'hospital_admin'),
  ('h1000000-0000-0000-0000-000000000003',       'ESI Admin',               'admin@esi-central.gov.in',       'hospital_admin'),
  ('bb000001-0000-0000-0000-000000000001'::UUID, 'Blood Bank Officer',      'bloodbank@metronorth.gov.in',    'blood_bank_admin'),
  (NULL,                                         'Central Dispatcher',      'dispatch@medigrid.gov.in',       'dispatcher');

-- ============================================================
-- SAMPLE ALERTS
-- ============================================================
INSERT INTO alerts (hospital_id, type, severity, message) VALUES
  ('h1000000-0000-0000-0000-000000000002','bed_critical','critical','City General ICU at 92% capacity — 1 bed remaining. Recommend divert.'),
  ('h1000000-0000-0000-0000-000000000004','bed_critical','critical','District Medical College at 100% capacity across all departments.'),
  (NULL,'blood_critical','critical','O-Negative critically low across district — 2 units total. Cross-district request recommended.'),
  ('h1000000-0000-0000-0000-000000000001','blood_critical','warning','A-Negative at Metro North below 20% — 6 units remaining.'),
  (NULL,'ambulance_delay','warning','AMB-07 ETA exceeded by 6 minutes — heavy traffic on NH-48. Rerouting in progress.');
