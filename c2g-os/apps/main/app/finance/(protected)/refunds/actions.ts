'use server';

import { createClient } from '@/utils/supabase/server';
import { logAudit } from '@/utils/audit';

export async function getRefunds() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { data, error } = await supabase
    .from('refunds')
    .select(`
      id,
      amount,
      currency,
      reason,
      evidence_url,
      reference_id,
      status,
      created_at,
      customers (
        id,
        name,
        email,
        phone
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching refunds:", error);
    return { success: false, error: error.message };
  }

  return { success: true, refunds: data };
}

export async function processRefund(refundId: string, customerId: string, amount: number, newStatus: string, notes: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { data: current, error: fetchErr } = await supabase
    .from('refunds')
    .select('status')
    .eq('id', refundId)
    .single();

  if (fetchErr || !current) return { success: false, error: 'Refund not found' };
  if (current.status === newStatus) return { success: true };
  if (current.status === 'refunded' || current.status === 'rejected') {
     return { success: false, error: 'Refund already processed' };
  }

  const updates: any = { 
    status: newStatus,
    approved_by: user.id
  };
  
  if (newStatus === 'refunded') {
    updates.refunded_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('refunds')
    .update(updates)
    .eq('id', refundId);

  if (error) return { success: false, error: error.message };

  if (newStatus === 'refunded') {
     const { error: refundErr } = await supabase.rpc('fund_wallet', {
        p_customer_id: customerId,
        p_amount: amount,
        p_reference_id: refundId,
        p_description: 'Refund processed: ' + notes
     });
     if (refundErr) {
        console.error("Failed to add funds to wallet for refund", refundErr);
     }
  }

  await logAudit({
    userId: user.id,
    action: `UPDATE_REFUND_STATUS`,
    entity: 'refund',
    entityId: refundId,
    oldValue: { status: current.status },
    newValue: { status: newStatus, notes }
  });

  return { success: true };
}
