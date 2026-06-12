-- ==============================================================================
-- PHASE 11: MULTI-VENDOR IMPORTER PLATFORM MIGRATION
-- ==============================================================================

-- 1. Create Importers Table
CREATE TABLE IF NOT EXISTS public.importers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    store_slug TEXT NOT NULL UNIQUE,
    business_description TEXT,
    whatsapp TEXT NOT NULL,
    email TEXT NOT NULL,
    ghana_card TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    wallet_balance NUMERIC DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Modify Products Table (Safe Alterations)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS importer_id UUID REFERENCES public.importers(id) ON DELETE CASCADE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_code TEXT UNIQUE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS source_platform TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cost_price_cny NUMERIC;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS selling_price_ghs NUMERIC;

-- Create a sequence for product codes (P0001, P0002)
CREATE SEQUENCE IF NOT EXISTS product_code_seq START 1;

-- Function to auto-generate P-Codes before insert
CREATE OR REPLACE FUNCTION generate_product_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.product_code IS NULL THEN
        NEW.product_code := 'P' || LPAD(nextval('product_code_seq')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_product_code ON public.products;
CREATE TRIGGER trigger_generate_product_code
    BEFORE INSERT ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION generate_product_code();

-- 3. Modify E-Commerce Orders Table
ALTER TABLE public.ecom_orders ADD COLUMN IF NOT EXISTS importer_id UUID REFERENCES public.importers(id) ON DELETE SET NULL;
ALTER TABLE public.ecom_orders ADD COLUMN IF NOT EXISTS total_cost_ghs NUMERIC DEFAULT 0.00;
ALTER TABLE public.ecom_orders ADD COLUMN IF NOT EXISTS total_profit_ghs NUMERIC DEFAULT 0.00;
ALTER TABLE public.ecom_orders ADD COLUMN IF NOT EXISTS procurement_cycle_id UUID;
ALTER TABLE public.ecom_orders ADD COLUMN IF NOT EXISTS procurement_status TEXT DEFAULT 'pending' CHECK (procurement_status IN ('pending', 'purchased', 'in_warehouse', 'consolidated', 'shipped', 'in_transit', 'arrived_ghana', 'clearance', 'ready_for_pickup', 'delivered'));

-- 4. Create Procurement Cycles Table
CREATE TABLE IF NOT EXISTS public.procurement_cycles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL, -- e.g. "Cycle 15th June"
    cutoff_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'locked', 'procuring', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Withdrawals Table
CREATE TABLE IF NOT EXISTS public.withdrawals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    importer_id UUID NOT NULL REFERENCES public.importers(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    momo_number TEXT NOT NULL,
    momo_network TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.importers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_cycles ENABLE ROW LEVEL SECURITY;

-- Importers Policies
CREATE POLICY "Public can view approved importers" ON public.importers FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view own importer profile" ON public.importers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own importer profile" ON public.importers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pending profile" ON public.importers FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "Service role can manage importers" ON public.importers USING (true) WITH CHECK (true);

-- Withdrawals Policies
CREATE POLICY "Importers can view own withdrawals" ON public.withdrawals FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.importers WHERE id = importer_id));
CREATE POLICY "Importers can insert own withdrawals" ON public.withdrawals FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.importers WHERE id = importer_id));
CREATE POLICY "Service role can manage withdrawals" ON public.withdrawals USING (true) WITH CHECK (true);

-- Procurement Cycles Policies
CREATE POLICY "Public can view procurement cycles" ON public.procurement_cycles FOR SELECT USING (true);
CREATE POLICY "Service role can manage procurement cycles" ON public.procurement_cycles USING (true) WITH CHECK (true);

-- Update Products Policies to allow Importers to manage their own products
CREATE POLICY "Importers can view their own products" ON public.products FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.importers WHERE id = importer_id));
CREATE POLICY "Importers can insert products" ON public.products FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.importers WHERE id = importer_id));
CREATE POLICY "Importers can update own products" ON public.products FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.importers WHERE id = importer_id));
CREATE POLICY "Importers can delete own products" ON public.products FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.importers WHERE id = importer_id));
