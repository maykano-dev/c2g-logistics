-- 1. Create the `shipment_reservations` table
CREATE TABLE IF NOT EXISTS public.shipment_reservations (
    id TEXT PRIMARY KEY, -- e.g. RES-00051
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    shipping_mode TEXT NOT NULL CHECK (shipping_mode IN ('air_normal', 'air_express', 'sea')),
    deposit_amount NUMERIC DEFAULT 0.00,
    deposit_paid BOOLEAN DEFAULT FALSE,
    total_items INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'waiting_for_deposit', 'reserved_for_shipment', 'packed', 'assigned_to_shipment', 'in_transit', 'arrived_ghana', 'ready_for_pickup', 'completed', 'cancelled')),
    final_shipping_cost NUMERIC,
    tracking_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.shipment_reservations ENABLE ROW LEVEL SECURITY;

-- Customers can view their own reservations
CREATE POLICY "Enable read access for users to their own reservations" ON public.shipment_reservations
    FOR SELECT USING (customer_id = auth.uid());

-- Customers can insert their own reservations
CREATE POLICY "Enable insert for users" ON public.shipment_reservations
    FOR INSERT WITH CHECK (customer_id = auth.uid());

-- Customers can update their own reservations if not yet paid
CREATE POLICY "Enable update for users before payment" ON public.shipment_reservations
    FOR UPDATE USING (customer_id = auth.uid() AND NOT deposit_paid);

-- Admins can do everything
CREATE POLICY "Enable all access for admins" ON public.shipment_reservations
    FOR ALL USING (is_admin());

-- Service role access
CREATE POLICY "Service role full access to reservations" ON public.shipment_reservations
    FOR ALL USING (true) WITH CHECK (true);

-- 2. Add `reservation_id` to `shipments`, `orders`, and `ecom_orders`
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS reservation_id TEXT REFERENCES public.shipment_reservations(id) ON DELETE SET NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS reservation_id TEXT REFERENCES public.shipment_reservations(id) ON DELETE SET NULL;
ALTER TABLE public.ecom_orders ADD COLUMN IF NOT EXISTS reservation_id TEXT REFERENCES public.shipment_reservations(id) ON DELETE SET NULL;

-- 3. Insert default platform settings for deposits
INSERT INTO public.platform_settings (setting_key, setting_value, description)
VALUES 
    ('air_normal_deposit_usd', 25.00, 'The base USD deposit amount for Air Normal shipment reservations.'),
    ('air_express_deposit_usd', 44.00, 'The base USD deposit amount for Air Express shipment reservations.'),
    ('sea_deposit_ghs', 500.00, 'The flat GHS deposit amount for Sea Freight shipment reservations.'),
    ('usd_to_ghs_rate', 12.60, 'The exchange rate from USD to GHS for shipping and deposits.')
ON CONFLICT (setting_key) DO NOTHING;
