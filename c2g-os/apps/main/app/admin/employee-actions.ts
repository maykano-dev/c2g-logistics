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

export async function adminAddEmployeeByEmail(email: string, staffRole: string) {
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
    console.log("Looking up user by email:", email);
    // 1. Find user in customers table by email
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('id, name, email')
      .ilike('email', `%${email.trim()}%`)
      .limit(1)
      .maybeSingle();

    console.log("customerData:", customerData);
    console.log("customerError:", customerError);

    if (customerError || !customerData) {
      return { success: false, error: `User not found in customers table: ${customerError?.message || 'No record'}` };
    }

    const targetUserId = customerData.id;

    // 2. Check if already an employee
    const { data: existingEmployee } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', targetUserId)
      .maybeSingle();

    if (existingEmployee) {
      return { success: false, error: 'User is already an employee.' };
    }

    const fullName = customerData.name || 'Unknown Staff';

    // 3. Insert into employees
    const { error: insertError } = await supabase
      .from('employees')
      .insert({
        user_id: targetUserId,
        email: customerData.email,
        full_name: fullName,
        staff_role: staffRole
      });

    if (insertError) throw insertError;

    revalidatePath('/admin/(protected)/people/employees');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to add employee' };
  }
}

