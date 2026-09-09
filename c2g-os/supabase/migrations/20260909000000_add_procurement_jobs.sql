-- 1. Create procurement_jobs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.procurement_jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ecom_order_id UUID REFERENCES public.ecom_orders(id) ON DELETE CASCADE,
    outer_purchase_id TEXT,
    status TEXT DEFAULT 'pending_approval',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    CONSTRAINT procurement_jobs_ecom_order_id_key UNIQUE (ecom_order_id)
);

-- 1b. If the table ALREADY existed, we need to explicitly add missing columns!
ALTER TABLE public.procurement_jobs ADD COLUMN IF NOT EXISTS outer_purchase_id TEXT;
ALTER TABLE public.procurement_jobs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending_approval';
ALTER TABLE public.procurement_jobs ADD COLUMN IF NOT EXISTS ecom_order_id UUID REFERENCES public.ecom_orders(id) ON DELETE CASCADE;

-- If the constraint wasn't there, add it safely
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'procurement_jobs_ecom_order_id_key') THEN
        ALTER TABLE public.procurement_jobs ADD CONSTRAINT procurement_jobs_ecom_order_id_key UNIQUE (ecom_order_id);
    END IF;
END $$;

-- Enable RLS
ALTER TABLE public.procurement_jobs ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for procurement_jobs safely
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'procurement_jobs' 
        AND policyname = 'Enable read access for authenticated users'
    ) THEN
        CREATE POLICY "Enable read access for authenticated users" ON public.procurement_jobs
            FOR SELECT TO authenticated USING (true);
    END IF;
END $$;

-- 2. Ensure ecom_orders has the tracking_number column
-- (The scanner actions assume it exists, but we add it here just to be absolutely sure)
ALTER TABLE public.ecom_orders 
ADD COLUMN IF NOT EXISTS tracking_number TEXT;

-- 3. Backfill the existing order from your screenshot!
-- This will link MALL-5E67 to the correct HioBuy order ID (3316398998318259567)
INSERT INTO public.procurement_jobs (ecom_order_id, outer_purchase_id, status)
SELECT id, '3316398998318259567', 'pending_payment'
FROM public.ecom_orders
WHERE order_id = 'MALL-5E67'
ON CONFLICT (ecom_order_id) DO UPDATE 
SET outer_purchase_id = EXCLUDED.outer_purchase_id;

-- Note: If you have other past orders, you can copy the INSERT block above,
-- replace 'MALL-5E67' with the other order ID, and replace the long number 
-- with the order_id from HioBuy's dashboard to backfill them too!
