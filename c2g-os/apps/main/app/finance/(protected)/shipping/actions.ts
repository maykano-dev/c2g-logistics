'use server';

import { createClient } from '@/utils/supabase/server';

export async function getShippingFees() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // Unpaid shipping fees
  const { data: unpaid, error: unpaidErr } = await supabase
    .from('ecom_orders')
    .select(`
      id,
      order_id,
      customer_id,
      customer_name,
      customer_phone,
      customer_email,
      shipping_cost,
      shipping_fee_paid,
      shipping_method,
      order_status,
      created_at
    `)
    .eq('shipping_fee_paid', false)
    .gt('shipping_cost', 0)
    .order('created_at', { ascending: false });

  if (unpaidErr) {
    console.error("Error fetching unpaid shipping fees:", unpaidErr);
    return { success: false, error: unpaidErr.message };
  }

  // Paid shipping fees (recent)
  const { data: paid, error: paidErr } = await supabase
    .from('ecom_orders')
    .select(`
      id,
      order_id,
      customer_id,
      customer_name,
      customer_phone,
      customer_email,
      shipping_cost,
      shipping_fee_paid,
      shipping_method,
      order_status,
      created_at,
      shipping_fee_payment_reference
    `)
    .eq('shipping_fee_paid', true)
    .gt('shipping_cost', 0)
    .order('created_at', { ascending: false })
    .limit(50);

  const totalUnpaid = (unpaid || []).reduce((sum, o: any) => sum + Number(o.shipping_cost || 0), 0);
  const totalPaid = (paid || []).reduce((sum, o: any) => sum + Number(o.shipping_cost || 0), 0);

  return { 
    success: true, 
    unpaid: unpaid || [], 
    paid: paid || [],
    summary: { totalUnpaid, totalPaid, unpaidCount: (unpaid || []).length, paidCount: (paid || []).length }
  };
}
