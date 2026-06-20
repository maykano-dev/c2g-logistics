'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function adminUpdateSettings(settingsData: any) {
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

  try {
    const { error } = await supabase
      .from('settings')
      .update({
        exchange_rate_cny_to_ghs: settingsData.exchange_rate_cny_to_ghs,
        maintenance_mode: settingsData.maintenance_mode,
        rates: { ...settingsData.rates, service_fee_percentage: settingsData.service_fee_percentage }
      })
      .eq('id', settingsData.id || 1);

    if (error) throw error;
    
    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'UPDATE_SYSTEM_SETTINGS',
      entity_type: 'settings',
      entity_id: String(settingsData.id || 1),
      ip_address: 'server'
    });

    revalidatePath('/admin/(protected)/system/settings');
    // @ts-ignore - Next.js types might be out of sync
    revalidateTag('settings');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update settings' };
  }
}
