'use server';

import { createClient } from '@/utils/supabase/server';

export async function getWallets(query: string = '') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  let req = supabase
    .from('wallets')
    .select(`
      id,
      available_balance,
      held_balance,
      created_at,
      customer_id,
      customers (
        id,
        name,
        email,
        phone,
        customer_unique_id
      )
    `);

  if (query) {
    const q = `%${query}%`;
    const cleanQuery = query.trim();
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanQuery);

    // Find matching customers first
    const { data: matchedCustomers } = await supabase
      .from('customers')
      .select('id')
      .or(`name.ilike.${q},email.ilike.${q},phone.ilike.${q},customer_unique_id.ilike.${q}`);

    const customerIds = (matchedCustomers || []).map(c => c.id);

    if (isUUID) {
      if (customerIds.length > 0) {
        req = req.or(`id.eq.${cleanQuery},customer_id.eq.${cleanQuery},customer_id.in.(${customerIds.join(',')})`);
      } else {
        req = req.or(`id.eq.${cleanQuery},customer_id.eq.${cleanQuery}`);
      }
    } else {
      if (customerIds.length > 0) {
        req = req.in('customer_id', customerIds);
      } else {
        // Not a UUID and no customers matched the text, so no wallet will match.
        return { success: true, wallets: [] };
      }
    }
  }

  // Then limit to 100
  req = req.order('created_at', { ascending: false }).limit(100);

  const { data, error } = await req;

  if (error) {
    console.error('Error fetching wallets:', error);
    return { success: false, error: error.message };
  }

  const wallets = (data || []).map((wallet: any) => ({
    ...wallet,
    totalBalance: parseFloat(wallet.available_balance || 0) + parseFloat(wallet.held_balance || 0),
  }));

  return { success: true, wallets };
}
