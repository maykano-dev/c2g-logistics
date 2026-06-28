'use server';

import { createClient } from '@/utils/supabase/server';

export async function getCustomerDebts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // Fetch orders with unpaid shipping fees — this is the real source of customer debt
  const { data: unpaidOrders, error } = await supabase
    .from('ecom_orders')
    .select(`
      id,
      customer_id,
      customer_name,
      customer_phone,
      customer_email,
      shipping_cost,
      shipping_fee_paid,
      total_amount,
      payment_status,
      order_status
    `)
    .eq('shipping_fee_paid', false)
    .gt('shipping_cost', 0);

  if (error) {
    console.error("Debt fetch error", error);
    return { success: false, error: 'Failed to fetch debts' };
  }

  // Group by customer
  const customerMap = new Map();
  
  (unpaidOrders || []).forEach((order: any) => {
    const cid = order.customer_id;
    if (!customerMap.has(cid)) {
      customerMap.set(cid, {
        id: cid,
        name: order.customer_name || 'Unknown',
        email: order.customer_email || '',
        phone: order.customer_phone || '',
        unpaidShippingOrders: 0,
        totalShippingDebt: 0,
        unpaidOrderAmount: 0,
      });
    }
    
    const customer = customerMap.get(cid);
    customer.unpaidShippingOrders += 1;
    customer.totalShippingDebt += Number(order.shipping_cost || 0);
    
    if (order.payment_status !== 'paid') {
      customer.unpaidOrderAmount += Number(order.total_amount || 0);
    }
  });

  const debtors = Array.from(customerMap.values())
    .map(c => ({
      ...c,
      totalDebt: c.totalShippingDebt + c.unpaidOrderAmount,
      riskLevel: (c.totalShippingDebt + c.unpaidOrderAmount) > 1000 ? 'High' 
        : (c.totalShippingDebt + c.unpaidOrderAmount) > 200 ? 'Medium' : 'Low'
    }))
    .sort((a, b) => b.totalDebt - a.totalDebt);

  return { success: true, debtors };
}
