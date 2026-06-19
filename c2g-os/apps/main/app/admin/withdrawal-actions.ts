'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function adminHandleWithdrawal(withdrawalId: string, action: 'approve' | 'reject') {
  const supabase = await createClient();
  
  // Enforce admin check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  
  const { data: admin } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!admin) return { success: false, error: 'Unauthorized' };

  try {
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    
    // Attempt DB update
    const { error } = await supabase
      .from('withdrawals')
      .update({ status: newStatus })
      .eq('id', withdrawalId);

    if (error) throw error;
    
    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: action === 'approve' ? 'APPROVE_WITHDRAWAL' : 'REJECT_WITHDRAWAL',
      entity_type: 'withdrawal',
      entity_id: withdrawalId,
      details: { new_status: newStatus },
      ip_address: 'server'
    });

    revalidatePath('/admin/(protected)/finance/withdrawals');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || `Failed to ${action} withdrawal` };
  }
}
