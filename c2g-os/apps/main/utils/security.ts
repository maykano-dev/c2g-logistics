import { createClient } from '@supabase/supabase-js';

// We use the admin client here to bypass RLS for rate limits and session management
// Because this runs on the server, we use the service role key.
function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Supabase URL missing');
  }
  
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY is missing. Falling back to anon key. Some admin functions may fail due to RLS.');
  }

  if (!key) {
    throw new Error('Supabase keys missing');
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    key
  );
}

const MAX_ATTEMPTS = 5;
const RESET_TIME_MS = 15 * 60 * 1000; // 15 minutes

export async function checkRateLimit(ip: string, email: string = ''): Promise<boolean> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from('auth_rate_limits')
    .select('*')
    .eq('ip_address', ip)
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') { // not found error is fine
    console.error('Rate limit check error:', error);
    return true; // fail open if DB is down
  }

  const now = new Date();

  if (!data) {
    // First attempt
    await supabaseAdmin.from('auth_rate_limits').insert({
      ip_address: ip,
      email: email,
      attempt_count: 1,
      first_attempt_at: now.toISOString(),
      locked_until: null
    });
    return true;
  }

  if (data.locked_until && new Date(data.locked_until) > now) {
    return false; // Currently locked
  }

  // If time since first attempt > RESET_TIME, reset counter
  const firstAttempt = new Date(data.first_attempt_at);
  if (now.getTime() - firstAttempt.getTime() > RESET_TIME_MS) {
    await supabaseAdmin.from('auth_rate_limits').update({
      attempt_count: 1,
      first_attempt_at: now.toISOString(),
      locked_until: null
    }).eq('ip_address', ip).eq('email', email);
    return true;
  }

  // Increment attempt count
  const newCount = data.attempt_count + 1;
  let lockedUntil = null;
  
  if (newCount >= MAX_ATTEMPTS) {
    lockedUntil = new Date(now.getTime() + RESET_TIME_MS).toISOString();
  }

  await supabaseAdmin.from('auth_rate_limits').update({
    attempt_count: newCount,
    locked_until: lockedUntil
  }).eq('ip_address', ip).eq('email', email);

  return newCount <= MAX_ATTEMPTS;
}

export function getCountryFromIP(ip: string): string {
  // In a real app, use MaxMind or a service like ip-api.com
  // For now we'll do a simple hardcoded fallback
  return 'Ghana'; // Default fallback
}

export async function checkAnomalousLogin(userId: string, currentIp: string) {
  const currentCountry = getCountryFromIP(currentIp);
  
  const supabaseAdmin = getSupabaseAdmin();
  
  // Get last session
  const { data: lastSession } = await supabaseAdmin
    .from('user_sessions')
    .select('ip_address')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (lastSession && lastSession.ip_address) {
    const lastCountry = getCountryFromIP(lastSession.ip_address);
    if (lastCountry !== currentCountry) {
      // Send security alert
      // We could use Supabase email here if configured, or just log for now
      console.log(`[SECURITY ALERT]: Anomalous login for user ${userId} from ${currentCountry} (previously ${lastCountry})`);
    }
  }
}

export async function enforceSessionLimit(userId: string, maxSessions: number = 3) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: sessions } = await supabaseAdmin
    .from('user_sessions')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (sessions && sessions.length > maxSessions) {
    // Keep only the most recent 'maxSessions'
    const toDelete = sessions.slice(maxSessions).map(s => s.id);
    await supabaseAdmin
      .from('user_sessions')
      .delete()
      .in('id', toDelete);
  }
}
