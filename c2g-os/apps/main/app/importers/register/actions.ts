'use server';

import { createClient } from '@/utils/supabase/server';

export async function submitImporterRegistration(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const businessName = formData.get('storeName') as string;
  const storeSlug = formData.get('storeSlug') as string;
  const whatsapp = formData.get('whatsapp') as string;
  const email = formData.get('email') as string;
  const ghanaCard = formData.get('idNumber') as string;
  const businessDescription = formData.get('businessDescription') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const phone = formData.get('phone') as string;

  if (!businessName || !storeSlug || !whatsapp || !email || !ghanaCard) {
    return { success: false, error: 'Please fill in all required fields.' };
  }

  let currentUserId = user?.id;

  // If user is not logged in, we must create an account for them
  if (!currentUserId) {
    if (!password || !fullName) {
      return { success: false, error: 'Password and Full Name are required to create an account.' };
    }
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
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

  // Validate slug (alphanumeric and dashes only)
  if (!/^[a-z0-9-]+$/.test(storeSlug)) {
    return { success: false, error: 'Store URL can only contain lowercase letters, numbers, and hyphens.' };
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
      ghana_card: ghanaCard,
      business_description: businessDescription,
      status: 'pending'
    });

  if (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message || 'Failed to submit registration.' };
  }

  return { success: true };
}
