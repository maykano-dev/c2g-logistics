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
      customers!inner (
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

    if (isUUID) {
      req = req.or(`id.eq.${cleanQuery},customer_id.eq.${cleanQuery}`);
    } else {
      req = req.or(`name.ilike.${q},email.ilike.${q},phone.ilike.${q},customer_unique_id.ilike.${q}`, { foreignTable: 'customers' });
    }
  }

  // Then limit to 100
  req = req.order('created_at', { ascending: false }).limit(100);

  const { data, error } = await req;

  if (error) {
    console.error('Error fetching wallets:', error.message || JSON.stringify(error));
    return { success: false, error: error.message };
  }

  const wallets = (data || []).map((wallet: any) => ({
    ...wallet,
    totalBalance: parseFloat(wallet.available_balance || 0) + parseFloat(wallet.held_balance || 0),
  }));

  return { success: true, wallets };
}
