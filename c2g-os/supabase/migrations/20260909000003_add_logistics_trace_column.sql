ALTER TABLE public.ecom_orders ADD COLUMN IF NOT EXISTS logistics_trace JSONB DEFAULT NULL;
