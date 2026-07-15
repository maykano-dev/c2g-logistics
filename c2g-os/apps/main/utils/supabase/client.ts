import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

  let cookieName = 'sb-c2g-auth-token';
  
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    if (pathname.startsWith('/admin')) {
      cookieName = 'sb-c2g-admin-auth-token';
    } else if (pathname.startsWith('/staff') || pathname.startsWith('/finance')) {
      cookieName = 'sb-c2g-staff-auth-token';
    }
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
    {
      cookieOptions: {
        name: cookieName,
      }
    }
  )
}
