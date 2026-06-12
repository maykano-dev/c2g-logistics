import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Create or update customer record for this user if it doesn't exist
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Just try to insert, ignoring conflict
        await supabase.from('customers').insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || 'Customer',
          phone: user.user_metadata?.phone || null,
          status: 'active'
        }).select('id').maybeSingle() // Use maybeSingle to not throw if conflicting
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not verify your session`)
}
