-- Add image_url to shipments
ALTER TABLE public.shipments ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add unified reservation fee to platform_settings
INSERT INTO public.platform_settings (setting_key, setting_value, description)
VALUES 
    ('reservation_fee_ghs', 200.00, 'The flat GHS Shipping Advance required to reserve space on any shipment mode.')
ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    description = EXCLUDED.description;
