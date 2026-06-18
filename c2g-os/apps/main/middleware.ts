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
  } else if (path.startsWith('/auth/')) {
    if (!checkRateLimit(ip, '/auth', 10, 60000)) { // 10 req / minute
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const { data: { user }, error } = await supabase.auth.getUser()

  // Requirement: "middleware never redirects". We pass the auth status via headers.
  if (!user || error) {
    supabaseResponse.headers.set('x-auth-status', 'unauthenticated')
  } else {
    supabaseResponse.headers.set('x-auth-status', 'authenticated')
    supabaseResponse.headers.set('x-user-id', user.id)
  }

  return supabaseResponse
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
