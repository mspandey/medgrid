-- ============================================================
--  MEDIGRID — SUPABASE DATABASE SCHEMA
--  Run this in your Supabase SQL Editor (in order)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. DISTRICTS
-- ============================================================
CREATE TABLE districts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  state       TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. HOSPITALS
-- ============================================================
CREATE TABLE hospitals (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  district_id  UUID REFERENCES districts(id) ON DELETE SET NULL,
  name         TEXT NOT NULL,
  type         TEXT NOT NULL,           -- 'tertiary','secondary','esi','teaching','trauma','primary','railway'
  address      TEXT,
  latitude     NUMERIC(10,7),
  longitude    NUMERIC(10,7),
  phone        TEXT,
  email        TEXT,
  status       TEXT DEFAULT 'active',   -- 'active','inactive','emergency_only'
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. DEPARTMENTS
-- ============================================================
CREATE TABLE departments (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id  UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,  -- 'icu','nicu','women','general','child','deluxe'
  name         TEXT NOT NULL,
  total_beds   INT DEFAULT 0,
  floor_number INT,
  contact_ext  TEXT,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. BEDS (individual bed slots)
-- ============================================================
CREATE TABLE beds (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id  UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  hospital_id    UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  bed_code       TEXT NOT NULL,          -- e.g. 'ICU-01', 'NICU-03'
  status         TEXT DEFAULT 'available', -- 'available','occupied','maintenance','reserved'
  patient_id     UUID,                   -- link to patients when occupied
  notes          TEXT,
  last_updated   TIMESTAMPTZ DEFAULT NOW(),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hospital_id, bed_code)
);

-- ============================================================
-- 5. BED AVAILABILITY SNAPSHOT (time-series log)
-- ============================================================
CREATE TABLE bed_availability_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id     UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  department_id   UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  dept_type       TEXT NOT NULL,
  available_beds  INT NOT NULL,
  total_beds      INT NOT NULL,
  recorded_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. BLOOD BANKS
-- ============================================================
CREATE TABLE blood_banks (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id  UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  name         TEXT NOT NULL,
  address      TEXT,
  phone        TEXT,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. BLOOD INVENTORY
-- ============================================================
CREATE TABLE blood_inventory (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blood_bank_id  UUID NOT NULL REFERENCES blood_banks(id) ON DELETE CASCADE,
  blood_type     TEXT NOT NULL,   -- 'A+','A-','B+','B-','O+','O-','AB+','AB-'
  units          INT DEFAULT 0,
  capacity       INT DEFAULT 50,
  last_updated   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blood_bank_id, blood_type)
);

-- ============================================================
-- 8. BLOOD INVENTORY LOG (time-series)
-- ============================================================
CREATE TABLE blood_inventory_log (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blood_bank_id  UUID NOT NULL REFERENCES blood_banks(id) ON DELETE CASCADE,
  blood_type     TEXT NOT NULL,
  units_before   INT,
  units_after    INT,
  change_reason  TEXT,  -- 'donation','transfusion','expiry','transfer_in','transfer_out'
  recorded_by    TEXT,
  recorded_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. AMBULANCES
-- ============================================================
CREATE TABLE ambulances (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id   UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  unit_code     TEXT NOT NULL UNIQUE,  -- 'AMB-01'
  vehicle_reg   TEXT,
  type          TEXT DEFAULT 'als',    -- 'als','bls','neonatal','cardiac'
  status        TEXT DEFAULT 'available', -- 'available','en_route','on_scene','returning','maintenance'
  driver_name   TEXT,
  driver_phone  TEXT,
  latitude      NUMERIC(10,7),
  longitude     NUMERIC(10,7),
  last_location_update TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. PATIENTS (dispatch records)
-- ============================================================
CREATE TABLE patients (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT,
  age             INT,
  gender          TEXT,  -- 'M','F','Other'
  phone           TEXT,
  pickup_address  TEXT,
  pickup_lat      NUMERIC(10,7),
  pickup_lng      NUMERIC(10,7),
  condition       TEXT,
  priority        TEXT DEFAULT 'P2',  -- 'P1','P2','P3'
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. DISPATCH RECORDS
-- ============================================================
CREATE TABLE dispatch_records (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id        UUID REFERENCES patients(id) ON DELETE SET NULL,
  ambulance_id      UUID REFERENCES ambulances(id) ON DELETE SET NULL,
  hospital_id       UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  bed_id            UUID REFERENCES beds(id) ON DELETE SET NULL,
  dispatched_at     TIMESTAMPTZ DEFAULT NOW(),
  en_route_at       TIMESTAMPTZ,
  on_scene_at       TIMESTAMPTZ,
  patient_loaded_at TIMESTAMPTZ,
  arrived_hospital_at TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  status            TEXT DEFAULT 'dispatched',  -- 'dispatched','en_route','on_scene','transporting','completed','cancelled'
  distance_km       NUMERIC(6,2),
  response_time_sec INT,  -- seconds from dispatch to on-scene
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. DISPATCH LOCATION LOG (GPS trail)
-- ============================================================
CREATE TABLE dispatch_location_log (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispatch_id  UUID NOT NULL REFERENCES dispatch_records(id) ON DELETE CASCADE,
  latitude     NUMERIC(10,7) NOT NULL,
  longitude    NUMERIC(10,7) NOT NULL,
  speed_kmh    NUMERIC(5,1),
  recorded_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 13. ADMIN USERS
-- ============================================================
CREATE TABLE admin_users (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id  UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL UNIQUE,
  role         TEXT DEFAULT 'hospital_admin', -- 'super_admin','hospital_admin','blood_bank_admin','dispatcher'
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 14. ALERTS
-- ============================================================
CREATE TABLE alerts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id  UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,   -- 'bed_critical','blood_critical','ambulance_delay','system'
  severity     TEXT DEFAULT 'warning',  -- 'info','warning','critical'
  message      TEXT NOT NULL,
  is_resolved  BOOLEAN DEFAULT FALSE,
  resolved_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VIEWS (for dashboard queries)
-- ============================================================

-- Hospital bed summary view
CREATE OR REPLACE VIEW v_hospital_bed_summary AS
SELECT
  h.id AS hospital_id,
  h.name AS hospital_name,
  h.type AS hospital_type,
  h.status,
  d.type AS dept_type,
  d.name AS dept_name,
  d.total_beds,
  COUNT(b.id) FILTER (WHERE b.status = 'available') AS available_beds,
  COUNT(b.id) FILTER (WHERE b.status = 'occupied')  AS occupied_beds,
  COUNT(b.id) FILTER (WHERE b.status = 'maintenance') AS maintenance_beds
FROM hospitals h
LEFT JOIN departments d  ON d.hospital_id = h.id AND d.is_active = TRUE
LEFT JOIN beds b          ON b.department_id = d.id
GROUP BY h.id, h.name, h.type, h.status, d.type, d.name, d.total_beds;

-- District-wide blood inventory view
CREATE OR REPLACE VIEW v_blood_summary AS
SELECT
  bi.blood_type,
  SUM(bi.units)    AS total_units,
  SUM(bi.capacity) AS total_capacity,
  ROUND(100.0 * SUM(bi.units) / NULLIF(SUM(bi.capacity), 0), 1) AS stock_pct,
  CASE
    WHEN SUM(bi.units) = 0 THEN 'critical'
    WHEN 100.0 * SUM(bi.units) / NULLIF(SUM(bi.capacity),0) < 20 THEN 'low'
    ELSE 'ok'
  END AS level
FROM blood_inventory bi
GROUP BY bi.blood_type
ORDER BY bi.blood_type;

-- Active dispatch view
CREATE OR REPLACE VIEW v_active_dispatches AS
SELECT
  dr.id,
  dr.status,
  dr.dispatched_at,
  dr.response_time_sec,
  p.name  AS patient_name,
  p.age   AS patient_age,
  p.condition,
  p.priority,
  p.pickup_address,
  a.unit_code AS ambulance_unit,
  a.driver_name,
  h.name  AS destination_hospital
FROM dispatch_records dr
LEFT JOIN patients   p ON p.id = dr.patient_id
LEFT JOIN ambulances a ON a.id = dr.ambulance_id
LEFT JOIN hospitals  h ON h.id = dr.hospital_id
WHERE dr.status NOT IN ('completed','cancelled')
ORDER BY dr.dispatched_at DESC;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE hospitals         ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds               ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_inventory    ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambulances         ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatch_records   ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients           ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts             ENABLE ROW LEVEL SECURITY;

-- Public read on hospitals, departments, blood summary (dashboard visibility)
CREATE POLICY "Public can read hospitals"
  ON hospitals FOR SELECT USING (true);

CREATE POLICY "Public can read departments"
  ON departments FOR SELECT USING (true);

CREATE POLICY "Public can read beds"
  ON beds FOR SELECT USING (true);

CREATE POLICY "Public can read blood inventory"
  ON blood_inventory FOR SELECT USING (true);

CREATE POLICY "Public can read ambulances"
  ON ambulances FOR SELECT USING (true);

-- Only authenticated admins can write
CREATE POLICY "Admins can manage hospitals"
  ON hospitals FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage departments"
  ON departments FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage beds"
  ON beds FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage blood inventory"
  ON blood_inventory FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage ambulances"
  ON ambulances FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can read dispatch records"
  ON dispatch_records FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage dispatch records"
  ON dispatch_records FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can read patients"
  ON patients FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can read alerts"
  ON alerts FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================
-- REALTIME (enable for live dashboard)
-- ============================================================
-- Run in Supabase Dashboard → Database → Replication → enable for:
-- beds, blood_inventory, ambulances, dispatch_records, alerts

-- ============================================================
-- AUTO-UPDATE TRIGGERS
-- ============================================================

-- Update hospital updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_hospitals_updated_at
  BEFORE UPDATE ON hospitals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_departments_updated_at
  BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_ambulances_updated_at
  BEFORE UPDATE ON ambulances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-log bed availability when beds change
CREATE OR REPLACE FUNCTION log_bed_availability()
RETURNS TRIGGER AS $$
DECLARE
  dept_rec RECORD;
BEGIN
  SELECT d.id, d.type, d.total_beds, d.hospital_id
  INTO dept_rec
  FROM departments d WHERE d.id = NEW.department_id;

  INSERT INTO bed_availability_log (
    hospital_id, department_id, dept_type,
    available_beds, total_beds
  )
  SELECT
    dept_rec.hospital_id,
    dept_rec.id,
    dept_rec.type,
    COUNT(*) FILTER (WHERE status = 'available'),
    dept_rec.total_beds
  FROM beds WHERE department_id = dept_rec.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_log_bed_on_change
  AFTER INSERT OR UPDATE ON beds
  FOR EACH ROW EXECUTE FUNCTION log_bed_availability();

-- Auto-generate critical alerts for blood
CREATE OR REPLACE FUNCTION check_blood_alert()
RETURNS TRIGGER AS $$
DECLARE
  bank_rec RECORD;
  pct NUMERIC;
BEGIN
  SELECT bb.hospital_id, bb.name INTO bank_rec
  FROM blood_banks bb WHERE bb.id = NEW.blood_bank_id;

  pct := 100.0 * NEW.units / NULLIF(NEW.capacity, 0);

  IF pct < 10 THEN
    INSERT INTO alerts (hospital_id, type, severity, message)
    VALUES (
      bank_rec.hospital_id,
      'blood_critical',
      CASE WHEN pct = 0 THEN 'critical' ELSE 'warning' END,
      'Blood type ' || NEW.blood_type || ' at ' || ROUND(pct,1) || '% — ' || NEW.units || ' units remaining at ' || bank_rec.name
    )
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_blood_alert
  AFTER INSERT OR UPDATE ON blood_inventory
  FOR EACH ROW EXECUTE FUNCTION check_blood_alert();

-- ============================================================
-- INDEXES (performance)
-- ============================================================
CREATE INDEX idx_beds_hospital      ON beds(hospital_id);
CREATE INDEX idx_beds_department    ON beds(department_id);
CREATE INDEX idx_beds_status        ON beds(status);
CREATE INDEX idx_dispatch_status    ON dispatch_records(status);
CREATE INDEX idx_dispatch_amb       ON dispatch_records(ambulance_id);
CREATE INDEX idx_blood_type         ON blood_inventory(blood_type);
CREATE INDEX idx_alerts_hospital    ON alerts(hospital_id);
CREATE INDEX idx_alerts_resolved    ON alerts(is_resolved);
CREATE INDEX idx_avail_log_time     ON bed_availability_log(recorded_at);
