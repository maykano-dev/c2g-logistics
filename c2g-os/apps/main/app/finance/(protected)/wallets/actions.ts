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
    // Find matching customers first
    const { data: matchedCustomers } = await supabase
      .from('customers')
      .select('id')
      .or(`name.ilike.${q},email.ilike.${q},phone.ilike.${q},customer_unique_id.ilike.${q}`);

    const customerIds = (matchedCustomers || []).map(c => c.id);

    if (customerIds.length > 0) {
      req = req.or(`id.ilike.${q},customer_id.ilike.${q},customer_id.in.(${customerIds.join(',')})`);
    } else {
      req = req.or(`id.ilike.${q},customer_id.ilike.${q}`);
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
