CREATE TABLE IF NOT EXISTS auth_rate_limits (
  ip_address TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  attempt_count INTEGER DEFAULT 1,
  first_attempt_at TIMESTAMPTZ DEFAULT now(),
  locked_until TIMESTAMPTZ,
  PRIMARY KEY (ip_address, email)
);

-- Auto-cleanup old entries
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
  DELETE FROM auth_rate_limits WHERE first_attempt_at < now() - interval '1 hour';
$$ LANGUAGE sql;
