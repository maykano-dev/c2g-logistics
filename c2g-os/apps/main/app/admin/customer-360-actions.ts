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
    .select('*, wallet:wallets(*)')
    .eq('id', customerId)
    .single();

  if (error || !customer) return { success: false, error: 'Customer not found' };

  // Calculate lifetime value (very basic implementation for now, sums wallet_transactions or orders)
  // For now, we'll just sum all DEBIT transactions in wallet as lifetime value
  const { data: txs } = await adminClient
    .from('wallet_transactions')
    .select('amount')
    .eq('wallet_id', customer.wallet?.id)
    .eq('type', 'debit')
    .eq('status', 'successful');
    
  let ltv = 0;
  if (txs) {
    ltv = txs.reduce((sum: number, tx: any) => sum + Number(tx.amount), 0);
  }

  return { success: true, data: { ...customer, lifetime_value: ltv } };
}

export async function getCustomer360Financials(customerId: string) {
  const hasAccess = await verifyAccess();
  if (!hasAccess) return { success: false, error: 'Unauthorized' };

  const adminClient = getAdminClient();
  const { data: wallet } = await adminClient.from('wallets').select('id').eq('user_id', customerId).single();
  
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
    .eq('type', 'link_order')
    .order('created_at', { ascending: false })
    .limit(50);
    
  const { data: mallOrders } = await adminClient
    .from('orders')
    .select('*')
    .eq('customer_id', customerId)
    .neq('type', 'link_order')
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
    .eq('user_id', customerId)
    .order('created_at', { ascending: false });

  const { data: shipments } = await adminClient
    .from('shipments')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  return { success: true, data: { reservations: reservations || [], shipments: shipments || [] } };
}
