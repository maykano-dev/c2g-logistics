-- Add priority column to notifications table
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'info';

-- Create an index on priority for fast filtering if needed
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON public.notifications(priority);
