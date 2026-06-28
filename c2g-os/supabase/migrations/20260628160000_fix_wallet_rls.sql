-- Fix Visibility for Admins/Finance Officers
-- Allows authorized staff to read all records sitewide securely

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()) 
      OR EXISTS (SELECT 1 FROM public.finance_roles WHERE user_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Wallets
DROP POLICY IF EXISTS "Enable read for admins" ON public.wallets;
CREATE POLICY "Enable read for admins" ON public.wallets FOR SELECT USING (is_admin());

-- 2. Wallet Transactions
DROP POLICY IF EXISTS "Enable read for admins" ON public.wallet_transactions;
CREATE POLICY "Enable read for admins" ON public.wallet_transactions FOR SELECT USING (is_admin());

-- 3. Customers
DROP POLICY IF EXISTS "Enable read for admins" ON public.customers;
CREATE POLICY "Enable read for admins" ON public.customers FOR SELECT USING (is_admin());

-- 4. Orders (Link Orders)
DROP POLICY IF EXISTS "Enable read for admins" ON public.orders;
CREATE POLICY "Enable read for admins" ON public.orders FOR SELECT USING (is_admin());

-- 5. Shipments (Packages)
DROP POLICY IF EXISTS "Enable read for admins" ON public.shipments;
CREATE POLICY "Enable read for admins" ON public.shipments FOR SELECT USING (is_admin());
