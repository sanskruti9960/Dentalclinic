-- ===================================================================
-- Smita Dental Clinic & Implant Centre - PostgreSQL Relational Database Schema
-- Production PostgreSQL DDL & Seed Dataset
-- ===================================================================

-- 1. Users Table (Doctor & Patient Credentials)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('doctor', 'patient', 'DOCTOR', 'PATIENT')),
    patient_id VARCHAR(36),
    avatar_url VARCHAR(500),
    is_profile_complete BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Patients Table (Demographics, Medical History, Vitals)
CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(36) PRIMARY KEY,
    patient_id_code VARCHAR(30) UNIQUE NOT NULL, -- e.g. SDC-2026-101
    user_id VARCHAR(36),
    name VARCHAR(150) NOT NULL,
    age INT NOT NULL CHECK (age >= 0 AND age <= 125),
    gender VARCHAR(30) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150),
    address TEXT,
    blood_group VARCHAR(10),
    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(30),
    emergency_contact_relation VARCHAR(50),
    chief_complaint TEXT,
    previous_dental_history TEXT,
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    last_visit_date DATE,
    total_spent NUMERIC(10, 2) DEFAULT 0.00,
    balance_due NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Medical Alerts (Allergies, Systemic Conditions, Medications)
CREATE TABLE IF NOT EXISTS patient_medical_alerts (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(36) NOT NULL,
    alert_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 4. Dental Chart / Odontogram (Teeth 1 to 32 FDI/Universal Notation)
CREATE TABLE IF NOT EXISTS tooth_records (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) NOT NULL,
    tooth_number INT NOT NULL CHECK (tooth_number BETWEEN 1 AND 32),
    tooth_condition VARCHAR(30) NOT NULL CHECK (tooth_condition IN ('healthy', 'caries', 'filled', 'rct', 'crown', 'missing', 'implant', 'bridge')),
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT uq_patient_tooth UNIQUE (patient_id, tooth_number)
);

-- 5. Appointments Table (Multi-Chair Operatories 1, 2, 3)
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(36) PRIMARY KEY,
    appointment_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. APT-2026-081
    patient_id VARCHAR(36) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    patient_phone VARCHAR(30) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL, -- e.g. "10:30 AM"
    duration_minutes INT DEFAULT 30,
    doctor_name VARCHAR(150) NOT NULL DEFAULT 'Dr. Smita Bevle',
    chair_number INT NOT NULL CHECK (chair_number IN (1, 2, 3)),
    procedure_name VARCHAR(150) NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (status IN ('scheduled', 'checked-in', 'in-chair', 'completed', 'rescheduled', 'cancelled')),
    notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 6. Invoices Table (Financial Billing & Real-Time Gateway Settlements)
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(36) PRIMARY KEY,
    invoice_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. INV-2026-042
    patient_id VARCHAR(36) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    patient_phone VARCHAR(30) NOT NULL,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    tax NUMERIC(10, 2) DEFAULT 0.00,
    grand_total NUMERIC(10, 2) NOT NULL,
    amount_paid NUMERIC(10, 2) DEFAULT 0.00,
    balance_due NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('paid', 'partial', 'unpaid', 'overdue')),
    payment_method VARCHAR(30), -- 'cash', 'card', 'upi', 'netbanking', 'phonepe', 'gpay', 'paytm'
    payment_notes TEXT,
    transaction_id VARCHAR(100), -- Real-time UPI / Gateway Transaction Reference (e.g. UPI-TXN-...)
    settled_via VARCHAR(50),     -- 'phonepe', 'gpay', 'paytm', 'upi', 'card', 'netbanking', 'cash'
    settled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 7. Invoice Items Table (Line items per dental procedure)
CREATE TABLE IF NOT EXISTS invoice_items (
    id VARCHAR(36) PRIMARY KEY,
    invoice_id VARCHAR(36) NOT NULL,
    description VARCHAR(255) NOT NULL,
    procedure_code VARCHAR(50),
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- 8. Prescriptions Table (Electronic Rx by Dr. Smita Bevle)
CREATE TABLE IF NOT EXISTS prescriptions (
    id VARCHAR(36) PRIMARY KEY,
    prescription_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. RX-2026-055
    patient_id VARCHAR(36) NOT NULL,
    patient_name VARCHAR(150) NOT NULL,
    patient_age INT NOT NULL,
    patient_gender VARCHAR(20) NOT NULL,
    prescription_date DATE NOT NULL DEFAULT CURRENT_DATE,
    doctor_name VARCHAR(150) NOT NULL DEFAULT 'Dr. Smita Bevle',
    doctor_degree VARCHAR(100) DEFAULT 'BDS, MDS (Prosthodontics & Implantology)',
    doctor_reg_no VARCHAR(50) DEFAULT 'MH-DENT-48921',
    diagnosis TEXT NOT NULL,
    bp VARCHAR(20),
    pulse VARCHAR(20),
    sugar VARCHAR(20),
    general_advice TEXT,
    next_follow_up VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 9. Prescription Medicines Table
CREATE TABLE IF NOT EXISTS prescription_medicines (
    id VARCHAR(36) PRIMARY KEY,
    prescription_id VARCHAR(36) NOT NULL,
    medicine_name VARCHAR(150) NOT NULL,
    strength VARCHAR(50),
    dosage VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    timing VARCHAR(50) NOT NULL, -- 'Before Food', 'After Food', 'With Food', 'Bedtime'
    instructions TEXT,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE
);

-- 10. Clinical Notes (Doctor Operatory Notes per Visit)
CREATE TABLE IF NOT EXISTS clinical_notes (
    id VARCHAR(36) PRIMARY KEY,
    patient_id VARCHAR(36) NOT NULL,
    note_date DATE NOT NULL DEFAULT CURRENT_DATE,
    chief_complaint TEXT NOT NULL,
    clinical_examination TEXT NOT NULL,
    periodontal_status VARCHAR(100),
    radiographic_findings TEXT,
    proposed_treatment TEXT NOT NULL,
    chair_number INT CHECK (chair_number IN (1, 2, 3)),
    attending_doctor VARCHAR(150) NOT NULL DEFAULT 'Dr. Smita Bevle',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 11. Simulated SMS / Email Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('sms', 'email')),
    recipient_name VARCHAR(150) NOT NULL,
    recipient_contact VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'delivered' CHECK (status IN ('sent', 'delivered')),
    patient_id VARCHAR(36),
    target_role VARCHAR(20) NOT NULL CHECK (target_role IN ('doctor', 'patient', 'both'))
);

-- 12. Razorpay Payment Attempts & Verified Transactions Table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id VARCHAR(36) PRIMARY KEY,
    invoice_id VARCHAR(36) NOT NULL,
    patient_id VARCHAR(36) NOT NULL,
    razorpay_order_id VARCHAR(100) UNIQUE NOT NULL,
    razorpay_payment_id VARCHAR(100) UNIQUE,
    razorpay_signature VARCHAR(255),
    amount_paise BIGINT NOT NULL,
    amount_inr NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(30) NOT NULL CHECK (status IN ('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'CANCELLED', 'REFUNDED')),
    payment_method VARCHAR(50), -- upi, card, netbanking, wallet
    bank VARCHAR(50),
    wallet VARCHAR(50),
    vpa VARCHAR(100),
    payer_email VARCHAR(150),
    payer_contact VARCHAR(30),
    error_code VARCHAR(100),
    error_description TEXT,
    error_source VARCHAR(100),
    error_step VARCHAR(100),
    error_reason VARCHAR(100),
    notes JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMPTZ,
    captured_at TIMESTAMPTZ,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE RESTRICT,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT
);

-- 13. Idempotent Razorpay Webhook Events Log
CREATE TABLE IF NOT EXISTS payment_webhook_events (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(100) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    payload TEXT NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processing_error TEXT,
    received_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMPTZ
);

-- PostgreSQL Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_patients_code ON patients(patient_id_code);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_appointments_date_chair ON appointments(appointment_date, chair_number);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_patient ON invoices(patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_txn ON invoices(transaction_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_tooth_patient ON tooth_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_pay_txn_invoice ON payment_transactions(invoice_id);
CREATE INDEX IF NOT EXISTS idx_pay_txn_order ON payment_transactions(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_pay_txn_payment ON payment_transactions(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_pay_txn_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_webhook_event ON payment_webhook_events(event_id);

-- ===================================================================
-- Initial PostgreSQL Seed Data
-- ===================================================================

-- Doctor & Demo Patients Users
INSERT INTO users (id, name, email, phone, password_hash, role, patient_id, avatar_url, is_profile_complete, is_email_verified)
VALUES
('u-doctor', 'Dr. Smita Bevle', 'doctor@smitadental.com', '+91 98230 45678', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', 'doctor', NULL, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200', TRUE, TRUE),
('u-aarav', 'Aarav Sharma', 'aarav@example.com', '+91 98201 12345', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', 'patient', 'pat-1', NULL, TRUE, TRUE),
('u-priya', 'Priya Nair', 'priya@example.com', '+91 98202 23456', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', 'patient', 'pat-2', NULL, TRUE, TRUE),
('u-rajesh', 'Rajesh Patel', 'rajesh@example.com', '+91 98203 34567', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', 'patient', 'pat-3', NULL, TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Patients Master Records
INSERT INTO patients (id, patient_id_code, user_id, name, age, gender, phone, email, address, blood_group, chief_complaint, registration_date, total_spent, balance_due)
VALUES
('pat-1', 'SDC-2026-101', 'u-aarav', 'Aarav Sharma', 34, 'Male', '+91 98201 12345', 'aarav@example.com', 'Flat 402, Sai Heights, Kothrud, Pune', 'B+', 'Sensitivity on upper left molar and routine cleaning', '2026-01-15', 8500.00, 0.00),
('pat-2', 'SDC-2026-102', 'u-priya', 'Priya Nair', 29, 'Female', '+91 98202 23456', 'priya@example.com', 'B-12 Orchid Residency, Baner, Pune', 'O+', 'Evaluation for dental implant and ceramic crown', '2026-02-01', 35000.00, 0.00),
('pat-3', 'SDC-2026-103', 'u-rajesh', 'Rajesh Patel', 52, 'Male', '+91 98203 34567', 'rajesh@example.com', 'Plot 18, Gulmohar Park, Aundh, Pune', 'A+', 'Full mouth rehabilitation consultation', '2026-02-18', 12000.00, 2500.00)
ON CONFLICT (id) DO NOTHING;

-- Invoices with Real-Time Gateway Settlements
INSERT INTO invoices (id, invoice_number, patient_id, patient_name, patient_phone, invoice_date, due_date, subtotal, discount, tax, grand_total, amount_paid, balance_due, status, payment_method, transaction_id, settled_via, settled_at)
VALUES
('inv-101', 'INV-2026-041', 'pat-1', 'Aarav Sharma', '+91 98201 12345', '2026-03-01', '2026-03-01', 2500.00, 0.00, 0.00, 2500.00, 2500.00, 0.00, 'paid', 'upi', 'PHONEPE-TXN-9842104921', 'phonepe', '2026-03-01 11:45:00+00'),
('inv-102', 'INV-2026-042', 'pat-2', 'Priya Nair', '+91 98202 23456', '2026-03-05', '2026-03-05', 18000.00, 0.00, 0.00, 18000.00, 18000.00, 0.00, 'paid', 'upi', 'GPAY-TXN-66710491823', 'gpay', '2026-03-05 16:30:00+00'),
('inv-103', 'INV-2026-043', 'pat-3', 'Rajesh Patel', '+91 98203 34567', '2026-03-08', '2026-03-15', 7500.00, 500.00, 0.00, 7000.00, 4500.00, 2500.00, 'partial', 'card', 'CARD-TXN-1192847190', 'card', '2026-03-08 14:15:00+00')
ON CONFLICT (id) DO NOTHING;
