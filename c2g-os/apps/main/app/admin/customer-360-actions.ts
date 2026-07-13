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

export async function getCustomer360Core(customerId: string) {
  const hasAccess = await verifyAccess();
  if (!hasAccess) return { success: false, error: 'Unauthorized' };

  const adminClient = getAdminClient();

  const { data: customer, error } = await adminClient
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .single();

  if (error || !customer) return { success: false, error: 'Customer not found' };

  // Fetch Auth User Details for last_login
  const { data: authData } = await adminClient.auth.admin.getUserById(customerId);
  if (authData?.user) {
    customer.last_login = authData.user.last_sign_in_at;
  }
  customer.user_id = customerId;

  // Fetch Wallet
  const { data: wallet } = await adminClient.from('wallets').select('*').eq('customer_id', customerId).single();
  customer.wallet = wallet;

  // Calculate LTV
  let ltv = 0;
  
  // Sum Mall Orders
  const { data: ecomOrders } = await adminClient
    .from('ecom_orders')
    .select('total_amount')
    .eq('customer_id', customerId)
    .in('payment_status', ['paid', 'successful']);
  
  if (ecomOrders) {
    ltv += ecomOrders.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0);
  }

  // Sum Link Orders
  const { data: linkOrders } = await adminClient
    .from('orders')
    .select('total')
    .eq('customer_id', customerId)
    .in('payment_status', ['paid', 'completed']);
    
  if (linkOrders) {
    ltv += linkOrders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);
  }

  // Sum Shipments
  const { data: shipments } = await adminClient
    .from('shipments')
    .select('shipping_cost')
    .eq('customer_id', customerId)
    .eq('shipping_fee_paid', true);
    
  if (shipments) {
    ltv += shipments.reduce((sum: number, s: any) => sum + Number(s.shipping_cost || 0), 0);
  }

  return { success: true, data: { ...customer, lifetime_value: ltv } };
}

export async function getCustomer360Financials(customerId: string) {
  const hasAccess = await verifyAccess();
  if (!hasAccess) return { success: false, error: 'Unauthorized' };

  const adminClient = getAdminClient();
  const { data: wallet } = await adminClient.from('wallets').select('id').eq('customer_id', customerId).single();
  
  let transactions: any[] = [];
  if (wallet) {
    const { data: txs } = await adminClient
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', wallet.id)
      .order('created_at', { ascending: false })
      .limit(50);
    transactions = txs || [];
  }

  return { success: true, data: { transactions } };
}

export async function getCustomer360Orders(customerId: string) {
  const hasAccess = await verifyAccess();
  if (!hasAccess) return { success: false, error: 'Unauthorized' };

  const adminClient = getAdminClient();
  
  const { data: linkOrders } = await adminClient
    .from('orders')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(50);
    
  const { data: mallOrders } = await adminClient
    .from('ecom_orders')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(50);

  return { success: true, data: { linkOrders: linkOrders || [], mallOrders: mallOrders || [] } };
}

export async function getCustomer360Logistics(customerId: string) {
  const hasAccess = await verifyAccess();
  if (!hasAccess) return { success: false, error: 'Unauthorized' };

  const adminClient = getAdminClient();
  
  const { data: reservations } = await adminClient
    .from('shipment_reservations')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  const { data: shipments } = await adminClient
    .from('shipments')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  return { success: true, data: { reservations: reservations || [], shipments: shipments || [] } };
}
