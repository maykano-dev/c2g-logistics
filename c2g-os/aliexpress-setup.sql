-- Run this SQL in your Supabase SQL Editor

-- 1. Create the aliexpress_categories table
CREATE TABLE IF NOT EXISTS aliexpress_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  parent_id TEXT,
  last_synced TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure slug is unique
ALTER TABLE aliexpress_categories ADD CONSTRAINT unique_slug UNIQUE (slug);

-- 2. Modify the products table to support the Smart Gateway
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS aliexpress_id TEXT UNIQUE, 
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT, 
  ADD COLUMN IF NOT EXISTS price_snapshot_usd NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS catalog_type TEXT DEFAULT 'promoted',
  ADD COLUMN IF NOT EXISTS c2g_trust_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS purchase_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS supplier_id TEXT;

-- 3. Create search_query_cache table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS search_query_cache (
  query_hash TEXT PRIMARY KEY,
  query_text TEXT NOT NULL,
  result_data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create procurement_jobs table
CREATE TABLE IF NOT EXISTS procurement_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ecom_order_id UUID REFERENCES ecom_orders(id),
  status TEXT DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  next_attempt_at TIMESTAMPTZ DEFAULT NOW(),
  error_log TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Add procurement columns to ecom_orders
ALTER TABLE ecom_orders 
  ADD COLUMN IF NOT EXISTS alibaba_trade_id TEXT,
  ADD COLUMN IF NOT EXISTS alibaba_pay_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS alibaba_tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS alibaba_carrier TEXT,
  ADD COLUMN IF NOT EXISTS procurement_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS snapshot_price_usd NUMERIC,
  ADD COLUMN IF NOT EXISTS snapshot_exchange_rate NUMERIC;
