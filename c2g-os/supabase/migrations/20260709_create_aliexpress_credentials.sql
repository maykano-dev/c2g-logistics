-- Migration: Create aliexpress_credentials table
-- Replaces the old alibaba_credentials table for the AliExpress Open Platform integration
-- Run: 2026-07-09

CREATE TABLE IF NOT EXISTS aliexpress_credentials (
  id                      TEXT PRIMARY KEY DEFAULT 'default',
  access_token            TEXT NOT NULL,
  refresh_token           TEXT,
  buyer_access_token      TEXT,
  expires_at              TIMESTAMPTZ,
  refresh_token_expires_at TIMESTAMPTZ,
  user_nick               TEXT,
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Only server-side (service_role) should read/write credentials
ALTER TABLE aliexpress_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON aliexpress_credentials
  FOR ALL USING (auth.role() = 'service_role');

-- Grant service role full access
GRANT ALL ON aliexpress_credentials TO service_role;
