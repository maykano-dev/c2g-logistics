-- ==============================================================================
-- PHASE 1: ALIBABA SMART GATEWAY SCHEMA MIGRATION
-- ==============================================================================

-- 1. Rename old products table to legacy (due to ID type mismatch and heavy schema)
ALTER TABLE IF EXISTS public.products RENAME TO legacy_products;

-- 2. Create New Products Table (Ultra-lightweight Smart Gateway Schema)
CREATE TABLE public.products (
  id TEXT PRIMARY KEY, -- Alibaba product ID (needs to be TEXT to handle huge numbers)
  supplier_id TEXT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  thumbnail_url TEXT,
  price_snapshot_usd NUMERIC NOT NULL DEFAULT 0,
  category_id TEXT,
  catalog_type TEXT DEFAULT 'promoted', -- 'featured' or 'promoted'
  c2g_trust_score INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  last_synced TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Service role can manage products" ON public.products USING (true) WITH CHECK (true);

-- 3. Modify E-Commerce Orders Table
ALTER TABLE public.ecom_orders 
  ADD COLUMN IF NOT EXISTS alibaba_trade_id TEXT,
  ADD COLUMN IF NOT EXISTS alibaba_pay_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS alibaba_tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS alibaba_carrier TEXT,
  ADD COLUMN IF NOT EXISTS snapshot_price_usd NUMERIC,
  ADD COLUMN IF NOT EXISTS snapshot_exchange_rate NUMERIC;

-- Drop old constraints that might interfere with new procurement statuses
ALTER TABLE public.ecom_orders DROP CONSTRAINT IF EXISTS ecom_orders_procurement_status_check;

-- 4. Create Search Query Cache (TTL handled by application logic)
CREATE TABLE public.search_query_cache (
  query_hash TEXT PRIMARY KEY,
  query_text TEXT NOT NULL,
  result_data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Alibaba Categories
CREATE TABLE public.alibaba_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_id TEXT,
  last_synced TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Procurement Jobs Queue
CREATE TABLE public.procurement_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ecom_order_id UUID REFERENCES public.ecom_orders(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending_approval', 
  attempts INTEGER DEFAULT 0,
  next_attempt_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  error_log TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create Analytics, Tracking & Security Tables
CREATE TABLE public.product_price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  price_usd NUMERIC NOT NULL,
  exchange_rate_ghs NUMERIC NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.supplier_blacklist (
  e_company_id TEXT PRIMARY KEY,
  supplier_name TEXT,
  reason TEXT,
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.api_health_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL,
  status_code INTEGER,
  latency_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
