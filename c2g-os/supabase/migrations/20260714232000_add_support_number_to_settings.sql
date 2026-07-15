ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS support_number TEXT;
UPDATE public.settings SET support_number = '+233241465282' WHERE id = 1 AND support_number IS NULL;
