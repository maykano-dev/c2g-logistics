'use server';

import { createClient } from '@/utils/supabase/server';

export async function submitImporterRegistration(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in to register as an importer.' };
  }

  const businessName = formData.get('businessName') as string;
  const storeSlug = formData.get('storeSlug') as string;
  const whatsapp = formData.get('whatsapp') as string;
  const email = formData.get('email') as string;
  const ghanaCard = formData.get('ghanaCard') as string;
  const businessDescription = formData.get('businessDescription') as string;

  if (!businessName || !storeSlug || !whatsapp || !email || !ghanaCard) {
    return { success: false, error: 'Please fill in all required fields.' };
  }

  // Validate slug (alphanumeric and dashes only)
  if (!/^[a-z0-9-]+$/.test(storeSlug)) {
    return { success: false, error: 'Store URL can only contain lowercase letters, numbers, and hyphens.' };
  }

  // Check if user already applied
  const { data: existingApp } = await supabase
    .from('importers')
    .select('id, status')
    .eq('user_id', user.id)
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
      user_id: user.id,
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
