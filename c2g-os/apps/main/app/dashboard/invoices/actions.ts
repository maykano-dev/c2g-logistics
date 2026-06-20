'use server';

import { createClient } from '@/utils/supabase/server';
import { getCachedSettings } from '@/utils/cache';
export async function getInvoices() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  // Fetch Link Orders
  const { data: orders } = await supabase
    .from('orders')
    .select('id, created_at, payment_status, total, product_name')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch Mall Orders
  const { data: ecomOrders } = await supabase
    .from('ecom_orders')
    .select('id, order_id, created_at, payment_status, total_amount')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch Shipments (Registration fees)
  const { data: shipments } = await supabase
    .from('shipments')
    .select('id, tracking_number, created_at, registration_fee_paid')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false });

  const invoices: any[] = [];

  if (orders) {
    orders.forEach(o => {
      invoices.push({
        id: `link_${o.id}`,
        original_id: o.id,
        type: 'Link Order',
        reference: String(o.id).split('-').pop()?.substring(0, 8).toUpperCase() || String(o.id),
        description: o.product_name || 'Link Order Items',
        amount: parseFloat(o.total || 0),
        status: (o.payment_status === 'paid' || o.payment_status === 'Paid') ? 'paid' : 'unpaid',
        date: o.created_at,
        url: `/dashboard/invoices/link_${o.id}`
      });
    });
  }

  if (ecomOrders) {
    ecomOrders.forEach(o => {
      invoices.push({
        id: `mall_${o.id}`,
        original_id: o.id,
        type: 'Mall Order',
        reference: o.order_id || 'MALL-XXXX',
        description: 'C2G Mall Purchase',
        amount: parseFloat(o.total_amount || 0),
        status: (o.payment_status === 'paid' || o.payment_status === 'Paid') ? 'paid' : 'unpaid',
        date: o.created_at,
        url: `/dashboard/invoices/mall_${o.id}`
      });
    });
  }

  // We assume registration fee is 5 GHS if not paid, just for display.
  // Real invoice details will pull dynamic settings.
  if (shipments) {
    shipments.forEach(s => {
      invoices.push({
        id: `reg_${s.id}`,
        original_id: s.id,
        type: 'Package Registration',
        reference: s.tracking_number,
        description: `Registration Fee for Package ${s.tracking_number}`,
        amount: 5.00, // Approximate fallback, detail page fetches actual
        status: s.registration_fee_paid ? 'paid' : 'unpaid',
        date: s.created_at,
        url: `/dashboard/invoices/reg_${s.id}`
      });
    });
  }

  // Sort by date descending
  return invoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getInvoiceDetail(invoiceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [type, ...idParts] = invoiceId.split('_');
  const id = idParts.join('_');

  const settings = await getCachedSettings();

  if (type === 'link') {
    const { data: order } = await supabase.from('orders').select('*').eq('id', id).eq('customer_id', user.id).single();
    if (!order) return null;
    return {
      type: 'Link Order',
      reference: order.id.split('-').pop().substring(0, 8).toUpperCase(),
      date: order.created_at,
      status: (order.payment_status === 'paid' || order.payment_status === 'Paid') ? 'paid' : 'unpaid',
      customer_id: order.customer_id,
      items: [
        { description: order.product_name || 'Link Order Item', quantity: order.quantity || 1, amount: order.total }
      ],
      subtotal: parseFloat(order.total) / 1.05,
      tax: 0,
      fee: parseFloat(order.total) - (parseFloat(order.total) / 1.05),
      total: order.total,
      payId: id,
      payType: 'link_order'
    };
  } else if (type === 'mall') {
    const { data: ecom } = await supabase.from('ecom_orders').select('*').eq('id', id).eq('customer_id', user.id).single();
    if (!ecom) return null;
    return {
      type: 'Mall Order',
      reference: ecom.order_id,
      date: ecom.created_at,
      status: (ecom.payment_status === 'paid' || ecom.payment_status === 'Paid') ? 'paid' : 'unpaid',
      customer_id: ecom.customer_id,
      items: ecom.items.map((i: any) => ({ description: i.name, quantity: i.quantity, amount: (i.price * i.quantity) })),
      subtotal: ecom.subtotal,
      tax: 0,
      fee: ecom.service_fee || 0,
      total: ecom.total_amount,
      payId: id,
      payType: 'mall_order'
    };
  } else if (type === 'reg') {
    const { data: pkg } = await supabase.from('shipments').select('*').eq('id', id).eq('customer_id', user.id).single();
    if (!pkg) return null;
    const fee = settings?.rates?.package_registration_fee || 5;
    return {
      type: 'Package Registration',
      reference: pkg.tracking_number,
      date: pkg.created_at,
      status: pkg.registration_fee_paid ? 'paid' : 'unpaid',
      customer_id: pkg.customer_id,
      items: [
        { description: `Registration Fee for ${pkg.tracking_number}`, quantity: 1, amount: fee }
      ],
      subtotal: fee,
      tax: 0,
      fee: 0,
      total: fee,
      payId: id,
      payType: 'package_registration'
    };
  }

  return null;
}
