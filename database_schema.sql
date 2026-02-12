-- =============================================
-- ISLAMIC WILL GENERATOR - COMPLETE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing table if exists (for fresh start)
DROP TABLE IF EXISTS islamic_wills CASCADE;

-- =============================================
-- MAIN ISLAMIC WILLS TABLE
-- =============================================
CREATE TABLE islamic_wills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number TEXT,

    -- Testator Personal Information
    testator_name TEXT,
    testator_aka TEXT,
    testator_email TEXT,
    testator_phone TEXT,
    testator_address TEXT,
    testator_dob DATE,
    testator_pob TEXT,
    testator_gender TEXT,
    testator_ni TEXT,
    testator_passport TEXT,
    testator_country TEXT,

    -- Will Type
    will_type TEXT DEFAULT 'simple',

    -- Executor 1
    executor1_name TEXT,
    executor1_address TEXT,
    executor1_relationship TEXT,
    executor1_phone TEXT,
    executor1_email TEXT,

    -- Executor 2
    executor2_name TEXT,
    executor2_address TEXT,
    executor2_relationship TEXT,
    executor2_phone TEXT,
    executor2_email TEXT,

    -- Funeral Arrangements
    burial_location TEXT DEFAULT 'uk',
    repatriation_country TEXT,
    preferred_cemetery TEXT,
    preferred_mosque TEXT,
    funeral_instructions TEXT,
    funeral_budget NUMERIC DEFAULT 0,

    -- Family - Marital
    marital_status TEXT,
    spouse_name TEXT,
    marriage_date DATE,
    mahr_status TEXT,
    mahr_amount NUMERIC DEFAULT 0,

    -- Family - Children
    has_children BOOLEAN DEFAULT false,

    -- Family - Parents
    father_status TEXT,
    father_name TEXT,
    mother_status TEXT,
    mother_name TEXT,

    -- Religious Obligations
    unpaid_zakat NUMERIC DEFAULT 0,
    fidyah_days INTEGER DEFAULT 0,
    kaffarah NUMERIC DEFAULT 0,
    hajj_status TEXT,
    hajj_badal BOOLEAN DEFAULT false,
    forgiven_debts TEXT,

    -- Wasiyyah
    make_wasiyyah BOOLEAN DEFAULT false,

    -- Guardianship
    has_minor_children BOOLEAN DEFAULT false,
    guardian1_name TEXT,
    guardian1_address TEXT,
    guardian1_relationship TEXT,
    guardian1_phone TEXT,
    guardian1_religion TEXT,
    guardian2_name TEXT,
    guardian2_address TEXT,
    guardian2_relationship TEXT,
    upbringing_wishes TEXT,

    -- Special Circumstances
    organ_donation TEXT DEFAULT 'defer',
    has_non_muslim_relatives BOOLEAN DEFAULT false,
    non_muslim_relatives TEXT,
    preferred_scholar TEXT,
    madhab TEXT,
    additional_wishes TEXT,
    people_forgiven TEXT,

    -- JSON Data (stores all form data)
    will_data JSONB DEFAULT '{}',
    children_data JSONB DEFAULT '[]',
    debts_data JSONB DEFAULT '[]',
    assets_data JSONB DEFAULT '{}',
    wasiyyah_data JSONB DEFAULT '{}',

    -- Generated Will
    will_html TEXT,

    -- Status & Workflow
    status TEXT DEFAULT 'draft',

    -- Testator Signature
    testator_signed BOOLEAN DEFAULT false,
    testator_signed_at TIMESTAMPTZ,

    -- Witness 1
    witness1_name TEXT,
    witness1_address TEXT,
    witness1_occupation TEXT,
    witness1_signed BOOLEAN DEFAULT false,
    witness1_signed_at TIMESTAMPTZ,

    -- Witness 2
    witness2_name TEXT,
    witness2_address TEXT,
    witness2_occupation TEXT,
    witness2_signed BOOLEAN DEFAULT false,
    witness2_signed_at TIMESTAMPTZ,

    -- Solicitor Certification
    solicitor_name TEXT,
    solicitor_firm TEXT,
    solicitor_sra TEXT,
    solicitor_certified BOOLEAN DEFAULT false,
    solicitor_signed_at TIMESTAMPTZ,

    -- Mufti/Imam Certification
    mufti_name TEXT,
    mufti_institution TEXT,
    mufti_contact TEXT,
    mufti_certified BOOLEAN DEFAULT false,
    mufti_signed_at TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- AUTO-GENERATE REFERENCE NUMBER
-- =============================================
CREATE OR REPLACE FUNCTION generate_will_reference()
RETURNS TRIGGER AS $$
BEGIN
    NEW.reference_number := 'IW-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(NEW.id::TEXT, 1, 8));
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_will_reference ON islamic_wills;
CREATE TRIGGER set_will_reference
    BEFORE INSERT ON islamic_wills
    FOR EACH ROW
    EXECUTE FUNCTION generate_will_reference();

-- =============================================
-- AUTO-UPDATE TIMESTAMP
-- =============================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_will_timestamp ON islamic_wills;
CREATE TRIGGER update_will_timestamp
    BEFORE UPDATE ON islamic_wills
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- =============================================
-- INDEXES FOR FASTER QUERIES
-- =============================================
CREATE INDEX idx_wills_testator_name ON islamic_wills(testator_name);
CREATE INDEX idx_wills_testator_email ON islamic_wills(testator_email);
CREATE INDEX idx_wills_reference ON islamic_wills(reference_number);
CREATE INDEX idx_wills_status ON islamic_wills(status);
CREATE INDEX idx_wills_created ON islamic_wills(created_at DESC);

-- =============================================
-- ENABLE ROW LEVEL SECURITY (Optional)
-- Uncomment if you want to restrict access
-- =============================================
-- ALTER TABLE islamic_wills ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the web form)
-- CREATE POLICY "Allow anonymous insert" ON islamic_wills FOR INSERT WITH CHECK (true);

-- Allow anonymous select (for loading saved wills)
-- CREATE POLICY "Allow anonymous select" ON islamic_wills FOR SELECT USING (true);

-- Allow anonymous update
-- CREATE POLICY "Allow anonymous update" ON islamic_wills FOR UPDATE USING (true);

-- Allow anonymous delete
-- CREATE POLICY "Allow anonymous delete" ON islamic_wills FOR DELETE USING (true);

-- =============================================
-- DONE! Your database is ready.
-- =============================================
