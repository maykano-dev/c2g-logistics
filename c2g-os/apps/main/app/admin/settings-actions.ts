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
        maintenance_pages: settingsData.maintenance_pages ? JSON.stringify(settingsData.maintenance_pages) : undefined,
        store_name: settingsData.store_name,
        public_email: settingsData.public_email,
        public_phone: settingsData.public_phone,
        rate_link_orders: settingsData.rate_link_orders,
        rate_shop_products: settingsData.rate_shop_products,
        usd_ghs_rate: settingsData.usd_ghs_rate,
        minimum_local_delivery_fee: settingsData.minimum_local_delivery_fee,
        minimum_service_fee: settingsData.minimum_service_fee,
        local_delivery_percentage: settingsData.local_delivery_percentage,
        service_fee_percentage: settingsData.service_fee_percentage,
        rates: { 
          ...settingsData.rates, 
          service_fee_percentage: settingsData.service_fee_percentage,
          sea_closing_date: settingsData.sea_closing_date,
          sea_departure_date: settingsData.sea_departure_date
        }
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

export async function adminUpdateRegistrationFee(newFee: number) {
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
      .from('platform_settings')
      .upsert({
        setting_key: 'package_registration_fee',
        setting_value: newFee,
        updated_at: new Date().toISOString()
      }, { onConflict: 'setting_key' });

    if (error) throw error;
    
    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'UPDATE_PLATFORM_SETTING',
      entity_type: 'platform_settings',
      entity_id: 'package_registration_fee',
      details: { new_fee: newFee },
      ip_address: 'server'
    });

    revalidatePath('/dashboard/packages');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update fee' };
  }
}

export async function adminUpdatePlatformSettings(settingsArray: { setting_key: string, setting_value: number }[]) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  
  const { data: admin } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const upserts = settingsArray.map(s => ({
      setting_key: s.setting_key,
      setting_value: s.setting_value,
      updated_at: new Date().toISOString()
    }));
    
    const { error } = await supabase
      .from('platform_settings')
      .upsert(upserts, { onConflict: 'setting_key' });

    if (error) throw error;
    
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'UPDATE_PLATFORM_SETTINGS',
      entity_type: 'platform_settings',
      entity_id: 'multiple',
      details: { settings: settingsArray },
      ip_address: 'server'
    });

    revalidatePath('/admin/(protected)/system/settings');
    revalidatePath('/dashboard/reservations');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update platform settings' };
  }
}

export async function adminUpdateWarehouseAddress(id: string, updates: any) {
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
      .from('warehouse_addresses')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    
    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'UPDATE_WAREHOUSE_ADDRESS',
      entity_type: 'warehouse_addresses',
      entity_id: id,
      details: updates,
      ip_address: 'server'
    });

    revalidatePath('/admin/(protected)/system/settings');
    revalidatePath('/dashboard/warehouse');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update warehouse address' };
  }
}

