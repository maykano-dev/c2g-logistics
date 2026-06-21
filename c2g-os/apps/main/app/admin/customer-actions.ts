'use server';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function toggleCustomerStatus(customerId: string, currentIsBanned: boolean) {
  const supabase = await createClient();
  const adminClient = getAdminClient();
  
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
    const newIsBanned = !currentIsBanned;
    
    // 1. Update our database
    const { data: customer, error } = await supabase
      .from('customers')
      .update({ is_banned: newIsBanned })
      .eq('id', customerId)
      .select('user_id')
      .single();

    if (error) throw error;
    
    // 2. Enforce ban in Auth
    if (customer?.user_id) {
      if (newIsBanned) {
        await adminClient.auth.admin.updateUserById(customer.user_id, { ban_duration: '876000h' });
      } else {
        await adminClient.auth.admin.updateUserById(customer.user_id, { ban_duration: 'none' });
      }
    }
    
    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: newIsBanned ? 'BAN_USER' : 'UNBAN_USER',
      entity_type: 'customer',
      entity_id: customerId,
      details: { previous_banned: currentIsBanned, new_banned: newIsBanned },
      ip_address: 'server'
    });

    revalidatePath('/admin/(protected)/customers/users');
    return { success: true, newStatus: newIsBanned ? 'banned' : 'active' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update customer status' };
  }
}

export async function adminCreateUser(formData: FormData) {
  const supabase = await createClient();
  const adminClient = getAdminClient();

  // Enforce admin check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };
  
  const { data: admin } = await supabase.from('admins').select('*').eq('user_id', user.id).single();
  if (!admin) return { success: false, error: 'Unauthorized' };

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;

  try {
    // 1. Create in Supabase Auth (Auto-confirm)
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, phone }
    });

    if (authError) throw authError;

    // 2. Insert into customers table
    const uniqueId = 'CUS-' + Math.floor(100000 + Math.random() * 900000);
    const { error: dbError } = await adminClient.from('customers').insert({
      user_id: authData.user.id,
      customer_unique_id: uniqueId,
      name,
      email,
      phone,
      is_banned: false
    });

    if (dbError) {
      // Rollback Auth user if db insert fails to avoid dangling accounts
      await adminClient.auth.admin.deleteUser(authData.user.id);
      throw dbError;
    }

    revalidatePath('/admin/(protected)/customers/users');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function adminFetchUserDetails(customerId: string) {
  const supabase = await createClient();

  const { data: customer, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .single();

  if (error || !customer) return { success: false, error: 'Customer not found' };

  let stats = { shipments: 0, orders: 0 };
  
  if (customer.user_id) {
    const { count: shipmentsCount } = await supabase
      .from('shipments')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', customer.user_id);

    const { count: ordersCount } = await supabase
      .from('ecom_orders')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', customer.user_id);

    stats.shipments = shipmentsCount || 0;
    stats.orders = ordersCount || 0;
  }

  return { 
    success: true, 
    data: { 
      ...customer, 
      stats 
    } 
  };
}
