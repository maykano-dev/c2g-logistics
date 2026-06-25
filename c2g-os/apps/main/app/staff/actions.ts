'use server';

import { createClient } from '@/utils/supabase/server';

export async function verifyStaffCredentials(email: string, pass: string) {
  const supabase = await createClient();
  
  // Try signing in
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error || !data.user) {
    return { success: false, error: 'Invalid credentials' };
  }

  // Check if user is an employee
  const { data: employee, error: employeeError } = await supabase
    .from('employees')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (employeeError || !employee || employee.status !== 'active') {
    // If they aren't an active employee, check if they are an admin as a fallback
    // (In case an admin uses the staff portal to login)
    const { data: admin } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', data.user.id)
      .single();

    if (admin) {
      return { success: true, redirectTo: '/admin/dashboard' };
    }

    // Sign out immediately if not authorized at all
    await supabase.auth.signOut();
    return { success: false, error: 'Unauthorized access. You are not registered as active staff.' };
  }

  // Map roles to routes
  let redirectTo = '/dashboard';
  
  switch (employee.staff_role) {
    case 'customer_service':
      redirectTo = '/agent/dashboard';
      break;
    case 'admin':
    case 'manager':
    case 'founder':
      redirectTo = '/admin/dashboard';
      break;
    // Add warehouse, etc., in the future
    case 'warehouse':
      redirectTo = '/warehouse/dashboard';
      break;
    default:
      // If role is undefined or unknown, just send them to default dashboard
      redirectTo = '/dashboard';
  }

  return { 
    success: true, 
    redirectTo 
  };
}
