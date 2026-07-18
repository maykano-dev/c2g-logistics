CREATE TABLE public.scan_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_number TEXT NOT NULL,
    status TEXT NOT NULL,
    customer_name TEXT,
    message TEXT,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_scan_logs_tracking_number ON public.scan_logs(tracking_number);
CREATE INDEX idx_scan_logs_status ON public.scan_logs(status);

ALTER TABLE public.scan_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read scan_logs" ON public.scan_logs
    FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Allow authenticated users to insert scan_logs" ON public.scan_logs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Allow authenticated users to update scan_logs" ON public.scan_logs
    FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
