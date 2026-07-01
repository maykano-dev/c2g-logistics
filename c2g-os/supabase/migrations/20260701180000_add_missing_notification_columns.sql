-- Add missing columns to notifications table
ALTER TABLE public.notifications
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'info',
ADD COLUMN IF NOT EXISTS link TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
