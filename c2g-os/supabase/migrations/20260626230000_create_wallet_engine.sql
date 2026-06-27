-- ==============================================================================
-- PHASE 12: C2G WALLET ENGINE
-- ==============================================================================

-- 1. Create Wallets Table
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL UNIQUE REFERENCES public.customers(id) ON DELETE CASCADE,
    available_balance NUMERIC DEFAULT 0.00 CHECK (available_balance >= 0),
    held_balance NUMERIC DEFAULT 0.00 CHECK (held_balance >= 0),
    minimum_balance_threshold NUMERIC DEFAULT 100.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Wallet Transactions Table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL, -- Positive means adding to available_balance, Negative means deducting
    transaction_type TEXT NOT NULL CHECK (transaction_type IN (
        'top_up', 
        'mall_order', 
        'link_order', 
        'package_fee', 
        'shipping_deposit_hold', 
        'shipping_deposit_release', 
        'shipping_adjustment', 
        'invoice', 
        'refund',
        'withdrawal'
    )),
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    reference_id UUID, -- Optional foreign key to related entity (e.g. order_id, package_id)
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON public.wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON public.wallet_transactions(created_at);

-- 3. Trigger to auto-update wallets.updated_at
CREATE OR REPLACE FUNCTION update_wallet_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_wallet_timestamp ON public.wallets;
CREATE TRIGGER trigger_update_wallet_timestamp
    BEFORE UPDATE ON public.wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_wallet_timestamp();

-- 4. Trigger to Auto-create Wallet for New Customers
CREATE OR REPLACE FUNCTION create_wallet_for_new_customer()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.wallets (customer_id)
    VALUES (NEW.id)
    ON CONFLICT (customer_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_create_wallet_for_new_customer ON public.customers;
CREATE TRIGGER trigger_create_wallet_for_new_customer
    AFTER INSERT ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION create_wallet_for_new_customer();

-- 5. Seed Wallets for Existing Customers
INSERT INTO public.wallets (customer_id)
SELECT id FROM public.customers
ON CONFLICT (customer_id) DO NOTHING;

-- 6. Row Level Security
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Customers can view their own wallet
CREATE POLICY "Customers can view own wallet" 
    ON public.wallets FOR SELECT 
    USING (customer_id = auth.uid());

-- Customers can view their own transactions
CREATE POLICY "Customers can view own wallet transactions" 
    ON public.wallet_transactions FOR SELECT 
    USING (wallet_id IN (SELECT id FROM public.wallets WHERE customer_id = auth.uid()));

-- Service role has full access (for backend logic)
CREATE POLICY "Service role full access to wallets" 
    ON public.wallets USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access to transactions" 
    ON public.wallet_transactions USING (true) WITH CHECK (true);
