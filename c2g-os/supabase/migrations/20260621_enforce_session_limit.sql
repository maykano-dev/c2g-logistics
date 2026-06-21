-- Define the function to enforce max 2 sessions
CREATE OR REPLACE FUNCTION auth.enforce_session_limit()
RETURNS trigger AS $$
DECLARE
  old_session_id UUID;
  old_ip TEXT;
  old_user_agent TEXT;
BEGIN
  -- Find all sessions for this user beyond the 2 most recent ones
  FOR old_session_id, old_ip, old_user_agent IN
    SELECT id, ip::text, user_agent
    FROM auth.sessions
    WHERE user_id = NEW.user_id
    ORDER BY created_at DESC
    OFFSET 2
  LOOP
    -- 1. Log the invalidation silently to the existing enterprise audit_logs table
    INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details)
    VALUES (
      NEW.user_id, 
      'REMOVE_EXCESS_SESSION_LIMIT_EXCEEDED', 
      'auth_session', 
      old_session_id::text,
      old_ip, 
      old_user_agent, 
      jsonb_build_object(
        'reason', 'maximum_sessions_exceeded', 
        'new_login_ip', NEW.ip::text,
        'new_login_user_agent', NEW.user_agent,
        'deleted_session_id', old_session_id
      )
    );

    -- 2. Delete the old session from auth.sessions (this logs them out securely)
    DELETE FROM auth.sessions WHERE id = old_session_id;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger is applied
DROP TRIGGER IF EXISTS enforce_session_limit_trigger ON auth.sessions;

CREATE TRIGGER enforce_session_limit_trigger
AFTER INSERT ON auth.sessions
FOR EACH ROW EXECUTE PROCEDURE auth.enforce_session_limit();
