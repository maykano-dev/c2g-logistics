-- Make ghana_card optional and add face_verification_url
ALTER TABLE public.importers ALTER COLUMN ghana_card DROP NOT NULL;
ALTER TABLE public.importers ADD COLUMN IF NOT EXISTS face_verification_url TEXT;
