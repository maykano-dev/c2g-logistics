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

        // Check for phone number to ensure interceptor flow
        let hasPhone = !!user.user_metadata?.phone || !!user.phone;
        
        if (!hasPhone) {
          // Google OAuth can wipe custom user_metadata. 
          // Check if we actually have the phone number in our database.
          const { data: customer } = await supabase
            .from('customers')
            .select('phone')
            .eq('id', user.id)
            .single();
            
          if (customer?.phone) {
            hasPhone = true;
            // Restore it back into the auth session so middleware can see it
            await supabase.auth.updateUser({ data: { phone: customer.phone } });
          }
        }

        const redirectTarget = hasPhone ? next : '/auth/complete-profile';

        return NextResponse.redirect(`${origin}${redirectTarget}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not verify your session`)
}
