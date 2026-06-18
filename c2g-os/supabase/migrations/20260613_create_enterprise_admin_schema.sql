-- Phase 2: Enterprise Admin Architecture Tables

-- 1. Order Activity Feed (Procurement Notes)
CREATE TABLE IF NOT EXISTS order_activity_feed (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    activity_type VARCHAR(50) NOT NULL, -- 'note', 'status_change', 'price_change', 'customer_contact'
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE order_activity_feed ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_order_activity_feed_order_id ON order_activity_feed(order_id);

-- 2. Unmatched Packages Queue
CREATE TABLE IF NOT EXISTS unmatched_packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tracking_number VARCHAR(100),
    weight DECIMAL(10,2),
    cbm DECIMAL(10,4),
    arrival_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    notes TEXT,
    photos JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'resolved', 'lost', 'auction'
    assigned_customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    resolved_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE unmatched_packages ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_unmatched_packages_status ON unmatched_packages(status);
CREATE INDEX idx_unmatched_packages_tracking ON unmatched_packages(tracking_number);

-- 3. Supplier Management
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(50), -- '1688', 'Taobao', 'Alibaba', 'WeChat'
    store_link TEXT,
    contact_info TEXT,
    total_orders INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 100.00,
    avg_delivery_days DECIMAL(5,1) DEFAULT 0.0,
    disputes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- 4. Quality Control (QC) Inspections
CREATE TABLE IF NOT EXISTS qc_inspections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    package_id UUID REFERENCES incoming_packages(id) ON DELETE CASCADE,
    inspector_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'passed', 'failed', 'replacement_requested'
    notes TEXT,
    photos JSONB DEFAULT '[]'::jsonb,
    inspected_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE qc_inspections ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_qc_inspections_status ON qc_inspections(status);
CREATE INDEX idx_qc_inspections_package ON qc_inspections(package_id);

-- 5. Task Management
CREATE TABLE IF NOT EXISTS admin_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    department VARCHAR(50) NOT NULL, -- 'warehouse', 'procurement', 'finance', 'logistics', 'support'
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'in_progress', 'completed', 'blocked'
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    related_entity_id VARCHAR(255), -- Polymorphic reference (order_id, package_id, withdrawal_id)
    related_entity_type VARCHAR(50),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE admin_tasks ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_admin_tasks_department ON admin_tasks(department);
CREATE INDEX idx_admin_tasks_assignee ON admin_tasks(assignee_id);
CREATE INDEX idx_admin_tasks_status ON admin_tasks(status);

-- 6. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL, -- e.g., 'approve_withdrawal', 'change_shipment_status'
    entity_type VARCHAR(50) NOT NULL, -- 'withdrawal', 'shipment', 'package'
    entity_id VARCHAR(255),
    details JSONB, -- Store old/new values or extra context
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Add Admin Policies (Service Role bypasses RLS by default, but adding explicit admin policies is best practice)
-- Allow authenticated admins to full CRUD on all new tables
CREATE OR REPLACE FUNCTION is_admin(user_id UUID) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admins WHERE user_id = is_admin.user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Simple policies for admin access
CREATE POLICY "Admins full access to order_activity_feed" ON order_activity_feed FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access to unmatched_packages" ON unmatched_packages FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access to suppliers" ON suppliers FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access to qc_inspections" ON qc_inspections FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access to admin_tasks" ON admin_tasks FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access to audit_logs" ON audit_logs FOR ALL USING (is_admin(auth.uid()));

-- 7. Promotions
CREATE TABLE IF NOT EXISTS promotions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_percentage DECIMAL(5,2),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins full access to promotions" ON promotions FOR ALL USING (is_admin(auth.uid()));
