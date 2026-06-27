-- Phase 1: Finance ERP Schema
-- Contains tables for expenses, refunds, audit_logs, and finance_roles

-- 1. Finance Roles Table
CREATE TABLE IF NOT EXISTS public.finance_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'officer' CHECK (role IN ('officer', 'senior_officer', 'manager', 'cfo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 2. Expenses Table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'GHS',
    description TEXT NOT NULL,
    receipt_url TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    submitted_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Refunds Table
CREATE TABLE IF NOT EXISTS public.refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id),
    amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'GHS',
    reason TEXT NOT NULL,
    evidence_url TEXT,
    reference_id TEXT, -- E.g. LNK-1024 or Payment ID
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'approved', 'rejected', 'refunded')),
    submitted_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    refunded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Audit Logs Table (Immutable)
-- The audit_logs table was already created in Phase 2 Enterprise Admin Architecture.
-- We will reuse the existing public.audit_logs table which has entity_type, entity_id, details, ip_address, user_agent.

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_finance_roles_user ON public.finance_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON public.expenses(status);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON public.refunds(status);

-- RLS Policies
ALTER TABLE public.finance_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS, but we'll add basic read policies for admins
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.finance_roles;
CREATE POLICY "Enable read for authenticated users" ON public.finance_roles FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.expenses;
CREATE POLICY "Enable read for authenticated users" ON public.expenses FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.refunds;
CREATE POLICY "Enable read for authenticated users" ON public.refunds FOR SELECT USING (auth.role() = 'authenticated');

-- We leave INSERT/UPDATE restricted to the backend (service_role) to prevent unauthorized frontend manipulation.

-- RPC to get High Level Finance Stats (To optimize the dashboard)
CREATE OR REPLACE FUNCTION get_financial_health_kpis()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_liabilities NUMERIC;
  v_pending_withdrawals NUMERIC;
  v_pending_refunds NUMERIC;
  v_cash_available NUMERIC;
BEGIN
  -- 1. Total Wallet Liabilities (Sum of all customer balances)
  SELECT COALESCE(SUM(available_balance + held_balance), 0) INTO v_wallet_liabilities FROM public.wallets;

  -- 2. Total Pending Withdrawals
  SELECT COALESCE(SUM(amount), 0) INTO v_pending_withdrawals FROM public.withdrawals WHERE status = 'pending';

  -- 3. Total Pending Refunds
  SELECT COALESCE(SUM(amount), 0) INTO v_pending_refunds FROM public.refunds WHERE status IN ('pending', 'investigating');

  -- 4. Estimated Cash Available (Placeholder: In a real system this would query a bank balance table or integrate with Hubtel, but here we can return a mocked/calculated value or null)
  v_cash_available := 210540.00; -- Static placeholder as requested by user example, can be updated later

  RETURN jsonb_build_object(
    'wallet_liabilities', v_wallet_liabilities,
    'pending_withdrawals', v_pending_withdrawals,
    'pending_refunds', v_pending_refunds,
    'cash_available', v_cash_available
  );
END;
$$;
