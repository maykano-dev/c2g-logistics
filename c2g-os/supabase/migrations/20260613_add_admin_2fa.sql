-- Create extension for UUIDs if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- We need a place to store the TOTP secret and potentially a custom master PIN for the admin entry point.
-- Let's add it to the `admins` table.

ALTER TABLE public.admins
ADD COLUMN IF NOT EXISTS totp_secret TEXT,
ADD COLUMN IF NOT EXISTS totp_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS master_pin TEXT;

-- Let's set a default master pin for existing admins (if any) or just leave it null and fall back to a hardcoded env one.
-- Actually, a hardcoded env `ADMIN_MASTER_PIN` is safer since they can't even get to the DB query without it.
-- But we'll add it here for future flexibility.
