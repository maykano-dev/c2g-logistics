'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function adminBulkUpdateHeroImages(urls: string[]) {
  const supabase = await createClient();
  
  // Enforce admin check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  
  const { data: admin } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!admin) return { success: false, error: 'Unauthorized' };

  if (!urls || urls.length !== 15) {
    return { success: false, error: 'Exactly 15 images must be provided.' };
  }

  try {
    // 1. Delete all existing hero images
    const { error: delError } = await supabase
      .from('hero_images')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (delError) throw delError;

    // 2. Insert new ones, grouping them 5 per column
    const insertData = urls.map((url, i) => {
      let columnIndex = 1;
      if (i >= 5 && i < 10) columnIndex = 2;
      if (i >= 10) columnIndex = 3;

      return {
        image_url: url,
        column_index: columnIndex,
        sort_order: (i % 5) + 1
      };
    });

    const { error: insertError } = await supabase
      .from('hero_images')
      .insert(insertData);

    if (insertError) throw insertError;

    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'BULK_UPDATE_HERO_IMAGES',
      entity_type: 'hero_images',
      entity_id: 'bulk',
      ip_address: 'server'
    });

    revalidatePath('/');
    revalidatePath('/admin/(protected)/commerce/marketing');
    
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update hero images' };
  }
}

export async function getHeroImages() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('hero_images')
    .select('*')
    .order('column_index', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error || !data) {
    return { success: false, images: [] };
  }
  return { success: true, images: data };
}
