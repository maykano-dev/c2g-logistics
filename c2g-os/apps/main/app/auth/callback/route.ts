import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=No+authentication+code+received`)
  }

  const cookieStore = await cookies()
  
  // DEBUG LOGGING
  const allCookies = cookieStore.getAll();
  console.log('[auth/callback] Incoming cookies:', allCookies.map(c => c.name));

  // We will collect any cookies that Supabase wants to set or remove during the exchange
  // and manually apply them to the NextResponse to avoid Next.js 14 cookie-drop bugs on redirects.
  const cookieJar: { name: string, value: string, options: any }[] = [];

  const isLocal = process.env.NODE_ENV === 'development';

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieJar.push({ name, value, options: { ...options, secure: !isLocal } })
          })
        }
      },
      cookieOptions: { 
        name: 'sb-c2g-auth-token',
        secure: !isLocal
      }
    }
  )

  const buildRedirect = (url: string) => {
    const response = NextResponse.redirect(url)
    cookieJar.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options)
    })
    return response
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession error:', error.message)
    return buildRedirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  // Exchange succeeded — check if user has a phone number
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return buildRedirect(`${origin}/login?error=Session+could+not+be+established`)
  }

  // Try to upsert the customer record (non-blocking)
  try {
    await supabase.from('customers').insert({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || 'Customer',
      phone: user.user_metadata?.phone || null,
      status: 'active'
    }).select('id').maybeSingle()
  } catch (e) {
    console.error('[auth/callback] customer insert error (non-critical):', e)
  }

  let hasPhone = !!user.user_metadata?.phone || !!user.phone

  if (!hasPhone) {
    try {
      const { data: customer } = await supabase
        .from('customers')
        .select('phone')
        .eq('id', user.id)
        .maybeSingle()

      if (customer?.phone) {
        hasPhone = true
        await supabase.auth.updateUser({ data: { phone: customer.phone } })
      }
    } catch (e) {
      console.error('[auth/callback] phone lookup error (non-critical):', e)
    }
  }

  return buildRedirect(`${origin}${hasPhone ? next : '/auth/complete-profile'}`)
}
