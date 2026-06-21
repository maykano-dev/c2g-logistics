-- Add store_logo to importers table
ALTER TABLE public.importers ADD COLUMN IF NOT EXISTS store_logo TEXT;
