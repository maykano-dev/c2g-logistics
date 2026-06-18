'use server';

import { createClient } from '@/utils/supabase/server';
import speakeasy from 'speakeasy';
import { cookies } from 'next/headers';

export async function verifyAdminCredentials(email: string, pass: string) {
  const supabase = await createClient();
  
  // Try signing in
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error || !data.user) {
    return { success: false, error: 'Invalid credentials' };
  }

  // Check if user is an admin
  const { data: admin, error: adminError } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', data.user.id)
    .single();

  if (adminError || !admin) {
    // Sign out immediately if not an admin
    await supabase.auth.signOut();
    return { success: false, error: 'Unauthorized access' };
  }

  return { 
    success: true, 
    totpEnabled: admin.totp_enabled,
    userId: data.user.id 
  };
}

export async function setupTOTP(userId: string) {
  const supabase = await createClient();
  
  // Verify current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== userId) return { success: false, error: 'Unauthorized' };

  // Check admin
  const { data: admin } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!admin) return { success: false, error: 'Admin not found' };

  // If already enabled, don't generate a new one
  if (admin.totp_enabled && admin.totp_secret) {
    return { success: false, error: '2FA is already set up' };
  }

  // Generate secret
  const secret = speakeasy.generateSecret({ name: `C2G Logistics (${user.email})` });
  const otpauth = secret.otpauth_url;

  // Store secret temporarily (not enabled yet)
  await supabase
    .from('admins')
    .update({ totp_secret: secret.base32 })
    .eq('user_id', user.id);

  return { success: true, secret, otpauth };
}

export async function verifyTOTP(userId: string, token: string) {
  const supabase = await createClient();
  
  // Verify current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== userId) return { success: false, error: 'Unauthorized' };

  const { data: admin } = await supabase
    .from('admins')
    .select('totp_secret, totp_enabled')
    .eq('user_id', user.id)
    .single();

  if (!admin || !admin.totp_secret) {
    return { success: false, error: '2FA not configured' };
  }

  const isValid = speakeasy.totp.verify({
    secret: admin.totp_secret,
    encoding: 'base32',
    token: token,
    window: 1
  });

  if (isValid) {
    // If it was the first time setup, mark it as enabled
    if (!admin.totp_enabled) {
      await supabase
        .from('admins')
        .update({ totp_enabled: true })
        .eq('user_id', user.id);
    }
    
    // Set 2FA verification cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_2fa_verified', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/admin',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return { success: true };
  } else {
    return { success: false, error: 'Invalid authenticator code' };
  }
}
