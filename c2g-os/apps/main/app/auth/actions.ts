'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

// In-memory rate limiting (Note: in serverless environments, this resets per cold start. 
// For a fully robust setup, a Redis cache is recommended, but this stops basic brute forcing per instance).
const rateLimitMap = new Map<string, { count: number, resetAt: number }>();
const MAX_ATTEMPTS = 5;
const RESET_TIME_MS = 15 * 60 * 1000; // 15 minutes

async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RESET_TIME_MS });
    return true;
  }
  if (now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RESET_TIME_MS });
    return true;
  }
  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }
  record.count++;
  return true;
}

async function getClientContext() {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
  const ua = headersList.get('user-agent') || 'unknown';
  return { ip, ua };
}

export async function login(prevState: any, formData: FormData) {
  const { ip, ua } = await getClientContext();
  const isAllowed = await checkRateLimit(ip);
  if (!isAllowed) {
    return { error: 'Too many login attempts. Please try again later.' };
  }

  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.status === 429) {
      return { error: 'Too many login attempts. Please try again later.' }
    }
    let errorMessage = error.message || 'Could not authenticate user';
    
    if (errorMessage.toLowerCase().includes('fetch failed') || errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('failed to fetch')) {
      errorMessage = "We're having trouble connecting right now. Please check your internet connection and try again.";
    } else if (errorMessage === 'Invalid login credentials') {
      errorMessage = 'The email or password you entered is incorrect.';
    }

    return { error: errorMessage }
  }

  // Check MFA (Two-Factor Authentication)
  // If the user has enrolled factors, Supabase will issue a session but with aal1. 
  // We check the user's factors to see if an active totp factor exists.
  let requiresMfa = false;
  if (data.user) {
    const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (!factorsError && factorsData.totp && factorsData.totp.length > 0) {
      // User has TOTP enrolled. Check current assurance level.
      const { data: authLevel } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (authLevel && authLevel.currentLevel === 'aal1' && authLevel.nextLevel === 'aal2') {
        requiresMfa = true;
      }
    }
  }

  if (requiresMfa) {
    // Redirect to MFA challenge screen
    redirect('/login/mfa');
  }

  // If no MFA required (or successfully verified later), log the session
  if (data.user) {
    // Use service role if needed, or simply insert via authenticated session
    // since the user is now technically logged in at AAL1/AAL2.
    // However, since we might need admin privileges for some setups, we'll try standard insert.
    await supabase.from('user_sessions').insert({
      user_id: data.user.id,
      ip_address: ip,
      user_agent: ua
    });
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(prevState: any, formData: FormData) {
  const { ip } = await getClientContext();
  const isAllowed = await checkRateLimit(ip);
  if (!isAllowed) {
    return { error: 'Too many signup attempts. Please try again later.' };
  }

  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string

  if (!email || !password || !name) {
    return { error: 'Email, password, and name are required' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        phone: phone || '',
      }
    }
  })

  if (error) {
    if (error.status === 429) {
      return { error: 'Too many signup attempts. Please try again later.' }
    }
    return { error: error.message || 'Could not create account' }
  }

  return { success: true, message: 'Check your email to continue the sign in process' }
}

export async function resetPassword(prevState: any, formData: FormData) {
  const { ip } = await getClientContext();
  const isAllowed = await checkRateLimit(ip);
  if (!isAllowed) {
    return { error: 'Too many reset attempts. Please try again later.' };
  }

  const supabase = await createClient()

  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Email is required' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) {
    if (error.status === 429) {
      return { error: 'Too many reset attempts. Please try again later.' }
    }
    return { error: error.message || 'Could not send reset email' }
  }

  return { success: true, message: 'Password reset email sent' }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
