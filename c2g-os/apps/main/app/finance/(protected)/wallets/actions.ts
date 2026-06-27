'use server';

import { createClient } from '@/utils/supabase/server';

export async function getWallets(query: string = '') {
  const supabase = await createClient();
  
  // Verify access (handled broadly in layout, but let's double check)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  let req = supabase
    .from('wallets')
    .select(`
      id,
      available_balance,
      hold_balance,
      status,
      created_at,
      customer_id,
      customers (
        id,
        name,
        email,
        phone
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (query) {
    req = req.or(`id.ilike.%${query}%,customers.name.ilike.%${query}%,customers.email.ilike.%${query}%,customers.phone.ilike.%${query}%`);
  }

  const { data, error } = await req;

  if (error) {
    console.error("Error fetching wallets:", error);
    return { success: false, error: error.message };
  }

  // Calculate some derived stats
  const formattedData = data.map((wallet: any) => ({
    ...wallet,
    totalBalance: parseFloat(wallet.available_balance || 0) + parseFloat(wallet.hold_balance || 0),
    isFrozen: wallet.status === 'frozen'
  }));

  return { success: true, wallets: formattedData };
}
