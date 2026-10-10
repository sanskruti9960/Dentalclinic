-- ===================================================================
-- Smita Dental Clinic - PostgreSQL Migration V2
-- Add Razorpay Payment Gateway Transaction & Webhook Tracking Tables
-- ===================================================================

-- 1. Create payment_transactions table for tracking Razorpay orders, payments, and captures
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
    payment_method VARCHAR(50),
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
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMPTZ,
    captured_at TIMESTAMPTZ,
    CONSTRAINT fk_pay_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE RESTRICT,
    CONSTRAINT fk_pay_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT
);

-- 2. Create payment_webhook_events table for idempotent webhook processing
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

-- 3. Indexes for fast lookup and reconciliation
CREATE INDEX IF NOT EXISTS idx_pay_txn_invoice ON payment_transactions(invoice_id);
CREATE INDEX IF NOT EXISTS idx_pay_txn_order ON payment_transactions(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_pay_txn_payment ON payment_transactions(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_pay_txn_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_webhook_event ON payment_webhook_events(event_id);
