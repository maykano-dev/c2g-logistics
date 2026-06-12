-- Create user_sessions table for active device tracking
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookup by user_id
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own sessions
CREATE POLICY "Users can view own sessions"
    ON public.user_sessions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to delete their own sessions (for logging out devices)
CREATE POLICY "Users can delete own sessions"
    ON public.user_sessions
    FOR DELETE
    USING (auth.uid() = user_id);

-- Service role can insert (triggered by server-side Next.js logic)
CREATE POLICY "Service role can insert sessions"
    ON public.user_sessions
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service role can update sessions"
    ON public.user_sessions
    FOR UPDATE
    USING (true);
