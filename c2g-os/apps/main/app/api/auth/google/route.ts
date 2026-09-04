import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const cookieStore = await cookies();
  const isLocal = process.env.NODE_ENV === 'development';

  const cookieJar: { name: string, value: string, options: any }[] = [];

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
  );

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        prompt: 'select_account',
      }
    },
  });

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data?.url) {
    // Perform a standard 302 HTTP redirect to Google.
    const response = NextResponse.redirect(data.url);
    
    // Manually attach all PKCE cookies to the redirect to bypass Next.js dropping bugs
    cookieJar.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    return response;
  }

  return NextResponse.redirect(`${origin}/login?error=Could+not+initialize+Google+login`);
}
