-- Add momo_number to importers table for payment settings
ALTER TABLE public.importers ADD COLUMN IF NOT EXISTS momo_number TEXT;
