'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function adminHandleGalleryStatus(submissionId: string, action: 'approve' | 'reject' | 'delete') {
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
    if (action === 'delete') {
      const { error } = await supabase
        .from('gallery_submissions')
        .delete()
        .eq('id', submissionId);

      if (error) throw error;
      
      // Log the action
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'DELETE_GALLERY_SUBMISSION',
        entity_type: 'gallery_submission',
        entity_id: submissionId,
        ip_address: 'server'
      });
    } else {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      const { error } = await supabase
        .from('gallery_submissions')
        .update({ status: newStatus })
        .eq('id', submissionId);

      if (error) throw error;
      
      // Log the action
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: action === 'approve' ? 'APPROVE_GALLERY_SUBMISSION' : 'REJECT_GALLERY_SUBMISSION',
        entity_type: 'gallery_submission',
        entity_id: submissionId,
        details: { new_status: newStatus },
        ip_address: 'server'
      });
    }

    revalidatePath('/admin/(protected)/commerce/marketing');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || `Failed to ${action} gallery submission` };
  }
}
