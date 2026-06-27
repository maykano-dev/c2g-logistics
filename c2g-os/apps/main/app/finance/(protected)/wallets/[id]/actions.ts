'use server';

import { createClient } from '@/utils/supabase/server';
import { logAudit } from '@/utils/audit';

export async function getWalletLedger(walletId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // Fetch Wallet + Customer details
  const { data: wallet, error: walletError } = await supabase
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
    .eq('id', walletId)
    .single();

  if (walletError || !wallet) {
    return { success: false, error: 'Wallet not found' };
  }

  // Fetch Transactions
  const { data: transactions, error: txError } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('wallet_id', walletId)
    .order('created_at', { ascending: false })
    .limit(100); // Pagination could be added later

  if (txError) {
    return { success: false, error: 'Failed to fetch ledger' };
  }

  return { success: true, wallet, transactions };
}

export async function freezeWalletAction(walletId: string, currentStatus: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const newStatus = currentStatus === 'frozen' ? 'active' : 'frozen';

  const { error } = await supabase
    .from('wallets')
    .update({ status: newStatus })
    .eq('id', walletId);

  if (error) return { success: false, error: error.message };

  await logAudit({
    userId: user.id,
    action: newStatus === 'frozen' ? 'FREEZE_WALLET' : 'UNFREEZE_WALLET',
    entity: 'wallet',
    entityId: walletId,
    oldValue: { status: currentStatus },
    newValue: { status: newStatus, reason }
  });

  return { success: true };
}
