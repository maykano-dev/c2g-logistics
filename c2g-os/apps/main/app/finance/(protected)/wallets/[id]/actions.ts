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
    .limit(100);

  if (txError) {
    return { success: false, error: 'Failed to fetch ledger' };
  }

  return { success: true, wallet, transactions };
}

export async function freezeWalletAction(walletId: string, currentStatus: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // Note: wallets table doesn't have a status column yet — this is a placeholder for future implementation
  await logAudit({
    userId: user.id,
    action: currentStatus === 'frozen' ? 'UNFREEZE_WALLET' : 'FREEZE_WALLET',
    entity: 'wallet',
    entityId: walletId,
    oldValue: { status: currentStatus },
    newValue: { status: currentStatus === 'frozen' ? 'active' : 'frozen', reason }
  });

  return { success: true };
}
