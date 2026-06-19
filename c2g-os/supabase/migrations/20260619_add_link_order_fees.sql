ALTER TABLE settings
ADD COLUMN IF NOT EXISTS service_fee_percentage numeric DEFAULT 15,
ADD COLUMN IF NOT EXISTS minimum_service_fee numeric DEFAULT 5,
ADD COLUMN IF NOT EXISTS local_delivery_percentage numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS minimum_local_delivery_fee numeric DEFAULT 0;
