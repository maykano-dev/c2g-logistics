'use server';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';

function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function verifyAccess() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: admin } = await supabase.from('admins').select('id').eq('user_id', user.id).single();
  if (admin) return true;

  const { data: employee } = await supabase.from('employees').select('staff_role, status').eq('user_id', user.id).single();
  if (employee && employee.status === 'approved' && ['support', 'manager', 'admin', 'founder'].includes(employee.staff_role)) {
    return true;
  }

  return false;
}

export async function fetchAnnouncements() {
  const hasAccess = await verifyAccess();
  if (!hasAccess) return { success: false, error: 'Unauthorized' };

  const adminClient = getAdminClient();
  const { data, error } = await adminClient
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function createAnnouncement(payload: { title: string; message: string; type: string; priority: number; start_date?: string; end_date?: string }) {
  const hasAccess = await verifyAccess();
  if (!hasAccess) return { success: false, error: 'Unauthorized' };

  const adminClient = getAdminClient();
  const { data, error } = await adminClient
    .from('announcements')
    .insert([{ ...payload, is_active: true }])
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function toggleAnnouncement(id: string, currentStatus: boolean) {
  const hasAccess = await verifyAccess();
  if (!hasAccess) return { success: false, error: 'Unauthorized' };

  const adminClient = getAdminClient();
  const { error } = await adminClient
    .from('announcements')
    .update({ is_active: !currentStatus })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteAnnouncement(id: string) {
  const hasAccess = await verifyAccess();
  if (!hasAccess) return { success: false, error: 'Unauthorized' };

  const adminClient = getAdminClient();
  const { error } = await adminClient
    .from('announcements')
    .delete()
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
