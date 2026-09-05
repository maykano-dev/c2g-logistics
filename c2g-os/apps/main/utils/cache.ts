import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

// A generic server-side client without cookies for fetching global public data securely
export const globalSupabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fetches application settings with in-memory caching.
 * Revalidates every hour or when 'settings' tag is revalidated.
 */
export const getCachedSettings = unstable_cache(
  async () => {
    const { data: settings, error } = await globalSupabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single();
      
    if (error) {
      console.warn('Warning: Failed to fetch settings, using fallbacks:', error.message || error);
      // Return safe fallback settings to prevent crashes
      return {
        exchange_rate_ghs_to_cny: 0.52,
        markup_percentage: 5,
        support_whatsapp_number: '233550000000',
        support_email: 'support@c2g.com'
      };
    }
    return settings || {
        exchange_rate_ghs_to_cny: 0.52,
        markup_percentage: 5,
        support_whatsapp_number: '233550000000',
        support_email: 'support@c2g.com'
    };
  },
  ['global-settings'],
  { revalidate: 3600, tags: ['settings'] }
);

/**
 * Fetches active warehouse addresses with in-memory caching.
 * Revalidates every hour or when 'warehouse_addresses' tag is revalidated.
 */
export const getCachedWarehouseAddresses = unstable_cache(
  async () => {
    const { data: addresses, error } = await globalSupabase
      .from('warehouse_addresses')
      .select('*')
      .order('is_default', { ascending: false });
      
    if (error) {
      console.warn('Warning: Failed to fetch warehouse addresses:', error.message || error);
      return [];
    }
    return addresses || [];
  },
  ['warehouse-addresses'],
  { revalidate: 3600, tags: ['warehouse_addresses'] }
);
