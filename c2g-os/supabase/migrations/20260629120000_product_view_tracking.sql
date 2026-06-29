-- =====================================================================
-- Product View Tracking — Proper fix for Disk I/O overuse
-- =====================================================================
-- Problem: UPDATE products SET view_count = view_count + 1 was being
-- called on every product page view, triggering a Database Webhook
-- on every call (net.http_post), cascading into 55k+ HTTP calls and
-- 58k+ pg_cron log entries — exhausting the Disk I/O budget.
--
-- Solution:
-- 1. A lightweight product_view_logs table (NO webhook attached).
--    We insert a row here on every product view instead of updating products.
-- 2. A pg_cron job aggregates the logs back to products.view_count every hour.
--    The webhook only fires during actual product edits, not on every view.
-- =====================================================================

-- Step 1: Create the lightweight view log table
CREATE TABLE IF NOT EXISTS public.product_view_logs (
  id          bigserial PRIMARY KEY,
  product_id  integer NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  viewed_at   timestamptz NOT NULL DEFAULT now()
);

-- Step 2: Index for fast aggregation queries
CREATE INDEX IF NOT EXISTS idx_product_view_logs_product_id
  ON public.product_view_logs(product_id);

CREATE INDEX IF NOT EXISTS idx_product_view_logs_viewed_at
  ON public.product_view_logs(viewed_at);

-- Step 3: RLS — allow authenticated users to INSERT views (read denied for security)
ALTER TABLE public.product_view_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log a product view"
  ON public.product_view_logs
  FOR INSERT
  WITH CHECK (true);

-- Step 4: Create the aggregation function (runs via pg_cron)
CREATE OR REPLACE FUNCTION public.aggregate_product_view_counts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Aggregate all logs from the past 2 hours into products.view_count
  -- Uses a 2-hour window to catch any delayed inserts
  UPDATE public.products p
  SET view_count = COALESCE(p.view_count, 0) + agg.new_views
  FROM (
    SELECT
      product_id,
      COUNT(*) AS new_views
    FROM public.product_view_logs
    WHERE viewed_at >= (now() - interval '1 hour 10 minutes')
      AND viewed_at < (now() - interval '10 minutes')
    GROUP BY product_id
  ) agg
  WHERE p.id = agg.product_id;

  -- Prune old logs (keep only last 30 days to control table size)
  DELETE FROM public.product_view_logs
  WHERE viewed_at < (now() - interval '30 days');
END;
$$;

-- Step 5: Schedule the aggregation to run every hour via pg_cron
-- (requires pg_cron extension — already enabled on Supabase)
SELECT cron.schedule(
  'aggregate-product-views',   -- job name
  '0 * * * *',                 -- every hour at :00
  $$SELECT public.aggregate_product_view_counts()$$
);

-- Step 6: Create the missing foreign key indexes (fixes temp disk spill on product queries)
CREATE INDEX IF NOT EXISTS idx_product_images_product_id
  ON public.product_images(product_id);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id
  ON public.product_variants(product_id);
