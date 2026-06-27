'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

import { checkRateLimit, checkAnomalousLogin, enforceSessionLimit } from '@/utils/security';
import { LoginSchema, SignupSchema, ResetPasswordSchema } from '@/utils/security-schemas';

async function getClientContext() {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
  const ua = headersList.get('user-agent') || 'unknown';
  return { ip, ua };
}

  console.log("LOGIN ACTION STARTED");
export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { ip, ua } = await getClientContext();
  const emailRaw = (formData.get('email') as string || '').trim()
  const passwordRaw = formData.get('password') as string

  const validation = LoginSchema.safeParse({ email: emailRaw, password: passwordRaw });
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || 'Validation failed', email: emailRaw };
  }

  const { email, password } = validation.data;

  const isAllowed = await checkRateLimit(ip, email);
  if (!isAllowed) {
    return { error: 'Too many login attempts. Please try again later.', email };
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

    return { error: errorMessage, email }
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
    // Check anomalous login
    await checkAnomalousLogin(data.user.id, ip);

    await supabase.from('user_sessions').insert({
      user_id: data.user.id,
      ip_address: ip,
      user_agent: ua
    });

    // Enforce concurrent session limit
    await enforceSessionLimit(data.user.id);
  }

  revalidatePath('/', 'layout');
  
  const role = data.user?.user_metadata?.role;
  if (role === 'admin') {
    redirect('/admin');
  }

  // Check if they are an importer by querying the database (handles upgraded users)
  const { data: importerData } = await supabase
    .from('importers')
    .select('id')
    .eq('user_id', data.user.id)
    .single();

  if (importerData || role === 'importer') {
    redirect('/importer-dashboard');
  } else {
    redirect('/dashboard');
  }
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { ip } = await getClientContext();
  const emailRaw = formData.get('email') as string
  const passwordRaw = formData.get('password') as string
  const nameRaw = formData.get('name') as string
  const phoneRaw = formData.get('phone') as string

  const validation = SignupSchema.safeParse({ email: emailRaw, password: passwordRaw, name: nameRaw, phone: phoneRaw });
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || 'Validation failed' };
  }

  const { email, password, name, phone } = validation.data;

  const isAllowed = await checkRateLimit(ip, email);
  if (!isAllowed) {
    return { error: 'Too many signup attempts. Please try again later.' };
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
  const supabase = await createClient();
  const { ip } = await getClientContext();
  const emailRaw = formData.get('email') as string

  const validation = ResetPasswordSchema.safeParse({ email: emailRaw });
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || 'Validation failed' };
  }

  const { email } = validation.data;

  const isAllowed = await checkRateLimit(ip, email);
  if (!isAllowed) {
    return { error: 'Too many reset attempts. Please try again later.' };
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

  const headersList = await headers()
  const referer = headersList.get('referer') || ''

  if (referer.includes('/importer-dashboard')) {
    redirect('/importers/login')
  } else if (referer.includes('/admin')) {
    redirect('/admin')
  } else {
    redirect('/login')
  }
}
