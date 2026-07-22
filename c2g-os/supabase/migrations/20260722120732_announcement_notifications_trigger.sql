CREATE OR REPLACE FUNCTION trigger_announcement_notifications()
RETURNS TRIGGER SECURITY DEFINER AS $$
BEGIN
  -- 1. Remove previous notifications for this specific announcement for all users
  -- This prevents duplicate spam if an announcement is edited quickly
  DELETE FROM notifications
  WHERE type = 'announcement'
    AND metadata->>'announcement_id' = NEW.id::text;

  -- 2. Insert new personalized notifications for every active customer
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    priority,
    is_read,
    link,
    metadata
  )
  SELECT 
    id,
    NEW.title,
    NEW.message,
    'announcement',
    'info',
    false,
    '/dashboard',
    jsonb_build_object('announcement_id', NEW.id)
  FROM auth.users;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_announcements_upsert ON announcements;

CREATE TRIGGER trigger_announcements_upsert
AFTER INSERT OR UPDATE ON announcements
FOR EACH ROW
WHEN (NEW.is_active = true)
EXECUTE FUNCTION trigger_announcement_notifications();
