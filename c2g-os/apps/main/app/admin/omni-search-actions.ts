'use server';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';

function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Ensure the user is an admin or support staff before returning sensitive data
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

export async function searchOmni(query: string) {
  if (!query || query.length < 2) return { success: true, results: [] };
  
  const hasAccess = await verifyAccess();
  if (!hasAccess) return { success: false, error: 'Unauthorized' };

  const adminClient = getAdminClient();
  const q = `%${query}%`;
  
  const results: any[] = [];

  // 1. Search Customers
  const { data: customers } = await adminClient
    .from('customers')
    .select('id, name, email, phone, customer_unique_id')
    .or(`name.ilike.${q},email.ilike.${q},phone.ilike.${q},customer_unique_id.ilike.${q}`)
    .limit(5);

  if (customers) {
    customers.forEach(c => {
      results.push({
        type: 'customer',
        id: c.id,
        title: c.name,
        subtitle: `${c.email} | ${c.phone || 'No phone'}`,
        badge: c.customer_unique_id ? `${c.customer_unique_id}` : 'UNKNOWN',
      });
    });
  }

  // 2. Search Orders (Link / Mall)
  // Assuming 'id' is a uuid. We can only search if query looks like uuid or if tracking numbers are strings.
  // We will search tracking_number if it exists, or just short id.
  // Supabase doesn't let us use .ilike on UUID directly easily without casting, but if they search tracking number:
  const { data: orders } = await adminClient
    .from('orders')
    .select('id, type, tracking_number, customer:customers(name, email)')
    .or(`tracking_number.ilike.${q}`)
    .limit(3);

  if (orders) {
    orders.forEach(o => {
      results.push({
        type: 'order',
        id: o.id,
        orderType: o.type,
        title: `Order: ${o.tracking_number || o.id.substring(0,8)}`,
        subtitle: o.customer ? `Belongs to ${(o.customer as any).name}` : 'Unknown Customer',
        badge: o.type === 'link_order' ? 'Link Order' : 'Mall Order'
      });
    });
  }

  // 3. Search Shipment Reservations
  const { data: reservations } = await adminClient
    .from('shipment_reservations')
    .select('id, master_tracking_number, user_id')
    .or(`master_tracking_number.ilike.${q}`)
    .limit(3);

  if (reservations) {
    reservations.forEach(r => {
      results.push({
        type: 'reservation',
        id: r.id,
        title: `Reservation: ${r.master_tracking_number}`,
        subtitle: `User ID: ${r.user_id.substring(0,8)}`,
        badge: 'Reservation'
      });
    });
  }

  return { success: true, results };
}
