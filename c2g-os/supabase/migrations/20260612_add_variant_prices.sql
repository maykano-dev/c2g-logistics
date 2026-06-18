-- Add cost_price_cny and selling_price_ghs to product_variants

ALTER TABLE public.product_variants 
  ADD COLUMN IF NOT EXISTS cost_price_cny NUMERIC,
  ADD COLUMN IF NOT EXISTS selling_price_ghs NUMERIC;

-- Optional: backfill cost_price_cny if price_cny is populated (if that's how it was previously named)
-- UPDATE public.product_variants SET cost_price_cny = price_cny WHERE cost_price_cny IS NULL AND price_cny IS NOT NULL;
