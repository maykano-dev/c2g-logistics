'use server';

import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function getCustomerProfileData(customerId: string) {
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // We bypass RLS using the service role key because agents need to view all customers

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

  if (customerRes.error) console.error("Customer fetch error:", customerRes.error);
  if (linkOrdersRes.error) console.error("Link orders fetch error:", linkOrdersRes.error);
  if (mallOrdersRes.error) console.error("Mall orders fetch error:", mallOrdersRes.error);
  if (shipmentsRes.error) console.error("Shipments fetch error:", shipmentsRes.error);

  return {
    customer: customerRes.data || null,
    linkOrders: linkOrdersRes.data || [],
    mallOrders: mallOrdersRes.data || [],
    shipments: shipmentsRes.data || []
  };
}
