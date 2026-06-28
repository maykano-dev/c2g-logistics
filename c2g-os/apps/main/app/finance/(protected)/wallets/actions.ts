'use server';

import { createClient } from '@/utils/supabase/server';

export async function getWallets(query: string = '') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // Build query — wallets FK to customers via customer_id
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
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  const { data, error } = await req;

  if (error) {
    console.error('Error fetching wallets:', error);
    return { success: false, error: error.message };
  }

  let wallets = (data || []).map((wallet: any) => ({
    ...wallet,
    totalBalance: parseFloat(wallet.available_balance || 0) + parseFloat(wallet.held_balance || 0),
  }));

  // Client-side search filtering
  if (query) {
    const q = query.toLowerCase();
    wallets = wallets.filter((w: any) =>
      w.id.toLowerCase().includes(q) ||
      w.customer_id?.toLowerCase().includes(q) ||
      (w.customers && (
        (w.customers.name || '').toLowerCase().includes(q) ||
        (w.customers.email || '').toLowerCase().includes(q) ||
        (w.customers.phone || '').includes(q)
      ))
    );
  }

  return { success: true, wallets };
}
