'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleCustomerStatus(customerId: string, currentStatus: string) {
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
    const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
    
    const { error } = await supabase
      .from('customers')
      .update({ status: newStatus })
      .eq('id', customerId);

    if (error) throw error;
    
    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: newStatus === 'banned' ? 'BAN_USER' : 'UNBAN_USER',
      entity_type: 'customer',
      entity_id: customerId,
      details: { previous_status: currentStatus, new_status: newStatus },
      ip_address: 'server'
    });

    revalidatePath('/admin/(protected)/customers/users');
    return { success: true, newStatus };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update customer status' };
  }
}
