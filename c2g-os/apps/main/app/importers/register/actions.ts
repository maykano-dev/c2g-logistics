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

  // If user is not logged in, we must create an account for them
  if (!currentUserId) {
    if (!password || !fullName) {
      return { success: false, error: 'Password and Full Name are required to create an account.' };
    }

    // Explicitly check if the email is already in use
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email)
      .single();

    if (existingCustomer) {
      return { success: false, error: 'An account with this email already exists. Please log in first.' };
    }

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
    return { success: false, error: error.message || 'Failed to submit registration.' };
  }

  return { success: true };
}
