import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  const headersList = await headers()
  
  const pathname = headersList.get('x-pathname') || ''
  
  let cookieName: string | undefined = undefined;
  if (pathname.startsWith('/admin')) {
    cookieName = 'sb-c2g-admin-auth-token';
  } else if (pathname.startsWith('/staff') || pathname.startsWith('/finance')) {
    cookieName = 'sb-c2g-staff-auth-token';
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      cookieOptions: cookieName ? { name: cookieName } : undefined
    }
  )
}
