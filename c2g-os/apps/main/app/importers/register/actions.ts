'use server';

import { createClient } from '@/utils/supabase/server';
import { ImporterRegistrationSchema } from '@/utils/security-schemas';

export async function submitImporterRegistration(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const businessNameRaw = formData.get('storeName') as string;
  const storeSlugRaw = formData.get('storeSlug') as string;
  const whatsappRaw = formData.get('whatsapp') as string;
  const emailRaw = formData.get('email') as string;
  const ghanaCardRaw = formData.get('idNumber') as string;
  const businessDescriptionRaw = formData.get('businessDescription') as string;
  const passwordRaw = formData.get('password') as string;
  const fullNameRaw = formData.get('fullName') as string;
  const storeLogoRaw = formData.get('storeLogo') as string;
  const faceVerificationUrlRaw = formData.get('faceVerificationUrl') as string;
  const sameAsMomo = formData.get('sameAsMomo') === 'true';

  const validation = ImporterRegistrationSchema.safeParse({
    businessName: businessNameRaw,
    storeSlug: storeSlugRaw,
    whatsapp: whatsappRaw,
    email: emailRaw,
    businessDescription: businessDescriptionRaw,
    password: passwordRaw,
    fullName: fullNameRaw,
  });

  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || 'Validation failed' };
  }

  const { businessName, storeSlug, whatsapp, email, businessDescription, password, fullName } = validation.data;

  let currentUserId = user?.id;

  // If user is not logged in, we must create an account for them or log them in
  if (!currentUserId) {
    if (!password || !fullName) {
      return { success: false, error: 'Password and Full Name are required to create an account.' };
    }

    // 1. Try to silently log them in first, in case they already have a Customer account
    const { data: signInData } = await supabase.auth.signInWithPassword({ email, password });
    
    if (signInData.user) {
      // They already have an account and provided the correct password!
      currentUserId = signInData.user.id;
    } else {
      // 2. They either don't have an account, or provided the wrong password for an existing account.
      // Explicitly check if the email is already in use in customers table
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', email)
        .single();

      if (existingCustomer) {
        return { success: false, error: 'This email is already registered as a Customer. If this is your account, the password you entered is incorrect. Please click "Log in here" at the top.' };
      }

      // 3. Safe to sign up new user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: whatsapp,
            role: 'importer'
          }
        }
      });

      if (signUpError) {
        return { success: false, error: signUpError.message };
      }
      currentUserId = signUpData.user?.id;
    }
  }

  if (!currentUserId) {
    return { success: false, error: 'Failed to create user account.' };
  }

  if (!currentUserId) {
    return { success: false, error: 'Failed to create user account.' };
  }

  // Check if user already applied
  const { data: existingApp } = await supabase
    .from('importers')
    .select('id, status')
    .eq('user_id', currentUserId)
    .single();

  if (existingApp) {
    return { success: false, error: `You have already submitted an application. Status: ${existingApp.status}` };
  }

  // Check if storeSlug is taken
  const { data: existingSlug } = await supabase
    .from('importers')
    .select('id')
    .eq('store_slug', storeSlug)
    .single();

  if (existingSlug) {
    return { success: false, error: 'This Store URL is already taken. Please choose another.' };
  }

  const { error } = await supabase
    .from('importers')
    .insert({
      user_id: currentUserId,
      business_name: businessName,
      store_slug: storeSlug,
      whatsapp,
      email,
      business_description: businessDescription,
      status: 'pending',
      store_logo: storeLogoRaw,
      face_verification_url: faceVerificationUrlRaw,
      ...(sameAsMomo ? { momo_number: whatsapp } : {})
    });

  if (error) {
    console.error('Registration error:', error);
    
    // Handle Supabase Auth obfuscated fake ID insertion failure (happens when email already exists)
    if (error.code === '23503' && error.message.includes('importers_user_id_fkey')) {
      return { success: false, error: 'This email is already registered as an account. The password you entered is incorrect. Please click "Log in here" at the top.' };
    }
    
    return { success: false, error: error.message || 'Failed to submit registration.' };
  }

  return { success: true };
}
