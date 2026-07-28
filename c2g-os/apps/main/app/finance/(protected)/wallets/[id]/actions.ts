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

export async function manualWalletAdjustment(walletId: string, amount: number, type: 'top_up' | 'withdrawal', description: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  if (amount <= 0) return { success: false, error: 'Amount must be greater than zero' };

  // Generate Reference WLT-MANUAL-XXXXX
  const crypto = require('crypto');
  const ref = `WLT-MANUAL-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  // Try RPC first for atomic update
  const { data: rpcData, error: rpcError } = await supabase.rpc('admin_adjust_wallet_balance', {
    p_wallet_id: walletId,
    p_amount: amount,
    p_type: type,
    p_description: description,
    p_reference_id: ref
  });

  if (rpcError && rpcError.message.includes('does not exist')) {
    // Fallback: Non-atomic (Admin only, low concurrency risk)
    const { data: wallet } = await supabase.from('wallets').select('available_balance, customer_id').eq('id', walletId).single();
    if (!wallet) return { success: false, error: 'Wallet not found' };

    const newBalance = type === 'top_up' 
      ? Number(wallet.available_balance) + amount 
      : Number(wallet.available_balance) - amount;

    if (newBalance < 0) return { success: false, error: 'Insufficient balance' };

    await supabase.from('wallets').update({ available_balance: newBalance }).eq('id', walletId);
    await supabase.from('wallet_transactions').insert({
      wallet_id: walletId,
      amount: type === 'top_up' ? amount : -amount,
      transaction_type: type,
      status: 'completed',
      reference_id: ref,
      description
    });
  } else if (rpcError) {
    return { success: false, error: rpcError.message };
  } else if (rpcData && !rpcData.success) {
    return { success: false, error: rpcData.error };
  }

  // Fetch customer ID to send notification
  const { data: walletCust } = await supabase.from('wallets').select('customer_id').eq('id', walletId).single();

  // Audit
  await logAudit({
    userId: user.id,
    action: 'MANUAL_WALLET_ADJUSTMENT',
    entity: 'wallet',
    entityId: walletId,
    oldValue: null,
    newValue: { type, amount, description, reference: ref }
  });

  // Notify
  if (walletCust?.customer_id) {
    const { createNotification } = await import('@/utils/notifications');
    await createNotification({
      userId: walletCust.customer_id,
      title: type === 'top_up' ? 'Funds Added to Wallet' : 'Funds Deducted from Wallet',
      message: `Your wallet was ${type === 'top_up' ? 'credited with' : 'debited by'} ₵${amount.toFixed(2)}. Reason: ${description}`,
      type: 'payment',
      priority: 'important',
      link: '/dashboard/wallet'
    }).catch(e => console.warn('Failed to dispatch wallet notification:', e));
  }

  const { revalidatePath } = require('next/cache');
  revalidatePath(`/finance/wallets/${walletId}`);
  
  return { success: true };
}
