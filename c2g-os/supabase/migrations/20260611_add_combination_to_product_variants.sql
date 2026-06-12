-- Add combination column to product_variants table if it does not exist
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS combination JSONB;
