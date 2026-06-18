-- Phase 4: Finance & HR Schema Migration
-- Required for Withdrawals Authorization Tiers & Employee Attendance Tracking

-- 1. Create Withdrawals Table
CREATE TABLE IF NOT EXISTS public.withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    required_tier VARCHAR(50) NOT NULL DEFAULT 'officer' CHECK (required_tier IN ('officer', 'manager', 'founder')),
    reviewed_by UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safely add columns in case the table already existed from the legacy codebase
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE;
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS required_tier VARCHAR(50) NOT NULL DEFAULT 'officer' CHECK (required_tier IN ('officer', 'manager', 'founder'));
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS reviewed_by UUID;
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.withdrawals ADD COLUMN IF NOT EXISTS notes TEXT;

-- Index for fast queries by customer and status
CREATE INDEX IF NOT EXISTS idx_withdrawals_customer_id ON public.withdrawals(customer_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON public.withdrawals(status);

-- 2. Create Employee Attendance Table
CREATE TABLE IF NOT EXISTS public.employee_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'absent' CHECK (status IN ('clocked_in', 'clocked_out', 'absent', 'on_leave')),
    time_in TIMESTAMP WITH TIME ZONE,
    time_out TIMESTAMP WITH TIME ZONE,
    device_ip VARCHAR(45),
    warnings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying daily attendance
CREATE INDEX IF NOT EXISTS idx_employee_attendance_date ON public.employee_attendance(DATE(created_at));
CREATE INDEX IF NOT EXISTS idx_employee_attendance_employee ON public.employee_attendance(employee_id);

-- Add Row Level Security Policies
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_attendance ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read (in real app, restrict by role)
CREATE POLICY "Enable read access for all authenticated users" ON public.withdrawals FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for all authenticated users" ON public.withdrawals FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for all authenticated users" ON public.withdrawals FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all authenticated users" ON public.employee_attendance FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable insert access for all authenticated users" ON public.employee_attendance FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for all authenticated users" ON public.employee_attendance FOR UPDATE USING (auth.role() = 'authenticated');
