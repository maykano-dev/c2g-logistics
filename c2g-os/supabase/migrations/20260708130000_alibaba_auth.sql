-- ==============================================================================
-- PHASE 2: ALIBABA OAUTH CREDENTIALS
-- ==============================================================================

CREATE TABLE public.alibaba_credentials (
  id TEXT PRIMARY KEY DEFAULT 'default', -- We only need one active credentials row for the platform
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_in INTEGER,
  refresh_expires_in INTEGER,
  account_id TEXT,
  user_info JSONB,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for security
ALTER TABLE public.alibaba_credentials ENABLE ROW LEVEL SECURITY;

-- Only service role can manage credentials (never exposed to public)
CREATE POLICY "Service role can manage alibaba credentials" 
  ON public.alibaba_credentials 
  USING (true) 
  WITH CHECK (true);
