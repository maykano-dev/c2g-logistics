import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Simple in-memory rate limiter for middleware
// Note: Edge middleware limits this to the specific Vercel edge node, 
// so it's a loose limit, but good for basic defense-in-depth.
const rateLimitMap = new Map<string, { count: number, resetAt: number }>();

function checkRateLimit(ip: string, path: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const key = `${ip}:${path}`;
  
  // Clean up occasionally
  if (Math.random() < 0.01) {
    for (const [k, v] of Array.from(rateLimitMap.entries())) {
      if (now > v.resetAt) rateLimitMap.delete(k);
    }
  }

  const record = rateLimitMap.get(key);
  if (!record) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const path = request.nextUrl.pathname;

  // Apply rate limits to specific paths
  if (path.startsWith('/api/hubtel/initialize')) {
    if (!checkRateLimit(ip, '/api/hubtel/initialize', 10, 60000)) { // 10 req / minute
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  } else if (path.startsWith('/api/upload')) {
    if (!checkRateLimit(ip, '/api/upload', 20, 60000)) { // 20 req / minute
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  } else if (path.startsWith('/api/webhooks/')) {
    if (!checkRateLimit(ip, '/api/webhooks', 100, 60000)) { // 100 req / minute
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  } else if (path.startsWith('/auth/') && !path.startsWith('/auth/callback')) {
    if (!checkRateLimit(ip, '/auth', 10, 60000)) { // 10 req / minute
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  // CRITICAL: Do NOT run any Supabase logic on /auth/callback.
  // The PKCE code verifier cookie must be intact when the callback page loads.
  // Running getUser() here clears orphaned cookies and destroys the verifier.
  if (path === '/auth/callback') {
    const passthroughResponse = NextResponse.next({ request: { headers: request.headers } });
    passthroughResponse.headers.set('x-auth-status', 'unauthenticated');
    passthroughResponse.headers.set('x-pathname', path);
    return passthroughResponse;
  }

  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Determine cookie namespace based on the requested path
  let cookieName: string = 'sb-c2g-auth-token';
  const truePath = path === '/auth/callback' ? request.nextUrl.searchParams.get('next') || path : path;
  
  if (truePath.startsWith('/admin')) {
    cookieName = 'sb-c2g-admin-auth-token';
  } else if (truePath.startsWith('/staff') || truePath.startsWith('/finance')) {
    cookieName = 'sb-c2g-staff-auth-token';
  }

  // Inject the pathname into headers so Server Components can read it
  supabaseResponse.headers.set('x-pathname', truePath);
  request.headers.set('x-pathname', truePath); // Also set on incoming request so downstream code sees it

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          
          // CRITICAL: Next.js Server Components read from the 'cookie' header, NOT request.cookies!
          // We must serialize the updated cookies back into the request headers so downstream Server Components
          // see the refreshed tokens and don't trigger a refresh token race condition.
          const updatedCookieHeader = request.cookies.getAll().map(c => `${c.name}=${c.value}`).join('; ')
          request.headers.set('cookie', updatedCookieHeader)

          // Recreate response to update headers safely
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          // Re-apply our custom header!
          supabaseResponse.headers.set('x-pathname', truePath);
          
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
      cookieOptions: cookieName ? { 
        name: cookieName,
        path: '/',
        sameSite: 'lax',
        maxAge: 31536000
      } : undefined
    }
  )

  // Debug: log all cookies
  console.log(`[Middleware] Incoming cookies for ${path}:`, request.cookies.getAll().map(c => c.name));

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const { data: { user }, error } = await supabase.auth.getUser()

  // Clone headers properly to pass them downstream to Server Components
  const requestHeaders = new Headers(request.headers)
  
  if (!user || error) {
    console.log(`[Middleware] Auth Failed for path ${path}:`, error?.message || 'No user');
    requestHeaders.set('x-auth-status', 'unauthenticated')
  } else {
    console.log(`[Middleware] Auth Success for path ${path}. User ID:`, user.id);
    requestHeaders.set('x-auth-status', 'authenticated')
    requestHeaders.set('x-user-id', user.id)
    
    const hasPhone = !!user.user_metadata?.phone || !!user.phone;
    if (!hasPhone) {
      requestHeaders.set('x-needs-profile', 'true')
    }
  }

  // Ensure x-pathname is set
  requestHeaders.set('x-pathname', truePath)

  // Create the final response using the properly cloned request headers
  const finalResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Crucial: Copy cookies set by Supabase (e.g. token refresh) into the final response
  supabaseResponse.cookies.getAll().forEach(cookie => {
    finalResponse.cookies.set(cookie.name, cookie.value)
  })

  // Copy any other custom headers Supabase might have set on the response
  supabaseResponse.headers.forEach((value, key) => {
    finalResponse.headers.set(key, value)
  })

  return finalResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
