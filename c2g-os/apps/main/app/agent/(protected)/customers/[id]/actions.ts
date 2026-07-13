'use server';

import { createClient } from '@/utils/supabase/server';

export async function getCustomerProfileData(customerId: string) {
  const supabase = await createClient();

  // We don't check for user authentication strictly because the agent layout handles auth and RLS.
  // Assuming service role or agent RLS policies allow reading this data.

  const [
    customerRes,
    linkOrdersRes,
    mallOrdersRes,
    shipmentsRes
  ] = await Promise.all([
    supabase.from('customers').select('*').eq('id', customerId).single(),
    supabase.from('orders').select('*').eq('customer_id', customerId).order('created_at', { ascending: false }),
    supabase.from('ecom_orders').select('*').eq('customer_id', customerId).order('created_at', { ascending: false }),
    supabase.from('shipments').select('*').eq('customer_id', customerId).order('created_at', { ascending: false })
  ]);

  return {
    customer: customerRes.data || null,
    linkOrders: linkOrdersRes.data || [],
    mallOrders: mallOrdersRes.data || [],
    shipments: shipmentsRes.data || []
  };
}
