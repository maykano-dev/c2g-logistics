ALTER TABLE public.ecom_orders ADD COLUMN IF NOT EXISTS history JSONB DEFAULT '[]'::jsonb;
