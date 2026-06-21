-- ==============================================================================
-- AUTO-CONFIRM IMPORTER EMAILS
-- ==============================================================================
-- This trigger automatically sets email_confirmed_at to the current time 
-- whenever a new user signs up with the role 'importer' in their metadata.
-- This bypasses the need for email verification for importer accounts.

CREATE OR REPLACE FUNCTION public.auto_confirm_importer()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the user is signing up as an importer
  IF NEW.raw_user_meta_data->>'role' = 'importer' THEN
    -- Auto-confirm their email immediately
    NEW.email_confirmed_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it already exists to ensure a clean slate
DROP TRIGGER IF EXISTS trigger_auto_confirm_importer ON auth.users;

-- Create the trigger on auth.users before insert
CREATE TRIGGER trigger_auto_confirm_importer
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_confirm_importer();

-- NOTE: To also fix the existing test user (m@example.com) that got stuck:
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email_confirmed_at IS NULL AND raw_user_meta_data->>'role' = 'importer';
