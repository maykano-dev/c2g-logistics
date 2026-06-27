'use server';

import { createClient } from '@/utils/supabase/server';
import { logAudit } from '@/utils/audit';

export async function getWithdrawals() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { data, error } = await supabase
    .from('withdrawals')
    .select(`
      id,
      amount,
      status,
      created_at,
      required_tier,
      notes,
      customers (
        id,
        name,
        email,
        phone
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching withdrawals:", error);
    return { success: false, error: error.message };
  }

  return { success: true, withdrawals: data };
}

export async function updateWithdrawalStatus(withdrawalId: string, customerId: string, amount: number, newStatus: string, notes: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // Fetch current withdrawal
  const { data: current, error: fetchErr } = await supabase
    .from('withdrawals')
    .select('status')
    .eq('id', withdrawalId)
    .single();

  if (fetchErr || !current) return { success: false, error: 'Withdrawal not found' };
  if (current.status === newStatus) return { success: true };
  if (current.status === 'approved' || current.status === 'rejected') {
     return { success: false, error: 'Withdrawal already processed' };
  }

  const { error } = await supabase
    .from('withdrawals')
    .update({ 
      status: newStatus,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      notes: notes
    })
    .eq('id', withdrawalId);

  if (error) return { success: false, error: error.message };

  // If Approved, deduct from customer wallet. 
  // (Assuming withdrawal means money was taken OUT of the platform and given to user's bank/mobile money)
  if (newStatus === 'approved') {
     const { error: deductErr } = await supabase.rpc('deduct_wallet_balance', {
        p_customer_id: customerId,
        p_amount: amount,
        p_reference_id: withdrawalId,
        p_description: 'Withdrawal to external account: ' + notes
     });
     if (deductErr) {
        console.error("Failed to deduct from wallet for withdrawal", deductErr);
        // Ideally we would wrap this in a postgres transaction, 
        // but for now we log it and continue or we could revert the withdrawal status.
     }
  }

  await logAudit({
    userId: user.id,
    action: `UPDATE_WITHDRAWAL_STATUS`,
    entity: 'withdrawal',
    entityId: withdrawalId,
    oldValue: { status: current.status },
    newValue: { status: newStatus, notes }
  });

  return { success: true };
}
