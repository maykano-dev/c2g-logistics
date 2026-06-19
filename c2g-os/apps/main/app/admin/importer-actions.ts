'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function adminHandleImporterStatus(importerId: string, action: 'approve' | 'reject') {
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
    const newStatus = action === 'approve' ? 'active' : 'rejected';
    
    const { error } = await supabase
      .from('importers')
      .update({ status: newStatus })
      .eq('id', importerId);

    if (error) throw error;
    
    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: action === 'approve' ? 'APPROVE_IMPORTER' : 'REJECT_IMPORTER',
      entity_type: 'importer',
      entity_id: importerId,
      details: { new_status: newStatus },
      ip_address: 'server'
    });

    revalidatePath('/admin/(protected)/commerce/importers');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || `Failed to ${action} importer` };
  }
}
