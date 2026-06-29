-- Platform Settings Table for Dynamic Configurations
CREATE TABLE IF NOT EXISTS public.platform_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value NUMERIC NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users
CREATE POLICY "Enable read access for all users" ON public.platform_settings
    FOR SELECT USING (true);

-- Allow admins to update
CREATE POLICY "Enable update for admins only" ON public.platform_settings
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
    );

-- Allow admins to insert
CREATE POLICY "Enable insert for admins only" ON public.platform_settings
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
    );

-- Insert the default package registration fee (5 GHS)
INSERT INTO public.platform_settings (setting_key, setting_value, description)
VALUES ('package_registration_fee', 5.00, 'The default flat fee (GHS) charged for registering a new package in the warehouse.')
ON CONFLICT (setting_key) DO NOTHING;
