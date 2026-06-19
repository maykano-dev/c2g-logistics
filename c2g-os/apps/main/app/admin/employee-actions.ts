'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function adminSetEmployeeStatus(employeeId: string, status: string, notes?: string, staffRole?: string) {
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
    const { data, error } = await supabase.rpc('admin_set_employee_status', {
      p_employee_id: employeeId,
      p_status: status,
      p_notes: notes || '',
      p_staff_role: staffRole || ''
    });

    if (error) throw error;
    
    revalidatePath('/admin/(protected)/people/employees');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update employee status' };
  }
}
