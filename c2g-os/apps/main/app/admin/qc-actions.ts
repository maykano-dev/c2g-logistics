'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function adminUpdateQCStatus(inspectionId: string, newStatus: string) {
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
    const { error } = await supabase
      .from('qc_inspections')
      .update({
        status: newStatus,
        inspected_at: new Date().toISOString(),
        inspector: admin.name || admin.email || 'System Admin'
      })
      .eq('id', inspectionId);

    if (error) throw error;
    
    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'UPDATE_QC_STATUS',
      entity_type: 'qc_inspection',
      entity_id: inspectionId,
      details: { new_status: newStatus },
      ip_address: 'server'
    });

    revalidatePath('/admin/(protected)/operations/qc');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update QC status' };
  }
}
