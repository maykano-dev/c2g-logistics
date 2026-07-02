'use server';

import { createClient } from '@/utils/supabase/server';
import { createNotification } from '@/utils/notifications';
import { revalidatePath } from 'next/cache';

export async function updateLinkOrderStatus(orderId: number, newStatus: string) {
  const supabase = await createClient();
  
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('customer_id')
    .eq('id', orderId)
    .single();

  if (fetchError || !order) return { success: false, error: 'Order not found' };

  const { error } = await supabase
    .from('orders')
    .update({ order_status: newStatus })
    .eq('id', orderId);

  if (error) return { success: false, error: error.message };

  await createNotification({
    userId: order.customer_id,
    title: 'Link Order Update',
    message: `Your link order (#${orderId}) status is now: ${newStatus.replace(/_/g, ' ').toUpperCase()}`,
    type: 'order_update',
    priority: 'info',
    link: '/dashboard/orders'
  });

  revalidatePath('/admin/operations/link-orders');
  return { success: true };
}

export async function invoiceLinkOrderShipping(orderId: number, amount: number) {
  const supabase = await createClient();
  
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('customer_id')
    .eq('id', orderId)
    .single();

  if (fetchError || !order) return { success: false, error: 'Order not found' };

  const { error } = await supabase
    .from('orders')
    .update({ shipping_cost: amount, shipping_fee_paid: false })
    .eq('id', orderId);

  if (error) return { success: false, error: error.message };

  await createNotification({
    userId: order.customer_id,
    title: 'Shipping Fee Invoiced',
    message: `A shipping fee of GHS ${amount} has been invoiced for your link order (#${orderId}). Please proceed to payment.`,
    type: 'payment_required',
    priority: 'important',
    link: '/dashboard/invoices'
  });

  revalidatePath('/admin/operations/link-orders');
  return { success: true };
}

export async function updateLinkOrderPaymentStatus(orderId: number, newStatus: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('orders').update({ payment_status: newStatus }).eq('id', orderId);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/operations/link-orders');
  return { success: true };
}

export async function updateLinkOrderShippingMode(orderId: number, newMode: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('orders').update({ shipping_mode: newMode }).eq('id', orderId);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/operations/link-orders');
  return { success: true };
}
