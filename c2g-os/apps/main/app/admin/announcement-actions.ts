'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createAnnouncement(title: string, content: string, targetAudience: string = 'all') {
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
      .from('announcements')
      .insert({
        title,
        content,
        target_audience: targetAudience,
        is_active: true,
        start_date: new Date().toISOString()
      });

    if (error) throw error;
    
    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'CREATE_ANNOUNCEMENT',
      entity_type: 'announcements',
      details: { title, target_audience: targetAudience },
      ip_address: 'server'
    });

    revalidatePath('/admin/(protected)/customers/announcements');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create announcement' };
  }
}
