'use server';

import { createClient } from '@/utils/supabase/server';

export async function getNotifications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  return data || [];
}

export async function markAsRead(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: 'Unauthorized' };

  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .eq('user_id', user.id);
    
  return { success: true };
}

export async function markAllAsRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: 'Unauthorized' };

  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false);
    
  return { success: true };
}

export async function deleteNotification(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: 'Unauthorized' };

  await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
    
  return { success: true };
}
