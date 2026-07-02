'use server';

import { createClient } from '@/utils/supabase/server';
import { createNotification } from '@/utils/notifications';
import { revalidatePath } from 'next/cache';

export async function updateMallOrderStatus(orderId: string, newStatus: string) {
  const supabase = await createClient();
  
  const { data: order, error: fetchError } = await supabase
    .from('ecom_orders')
    .select('customer_id, order_id')
    .eq('id', orderId)
    .single();

  if (fetchError || !order) return { success: false, error: 'Order not found' };

  // Map UI friendly names back to DB ENUM if needed, but we'll assume the UI sends the right value.
  const { error } = await supabase
    .from('ecom_orders')
    .update({ order_status: newStatus })
    .eq('id', orderId);

  if (error) return { success: false, error: error.message };

  // Notify User
  await createNotification({
    userId: order.customer_id,
    title: 'Mall Order Update',
    message: `Your mall order (${order.order_id}) status is now: ${newStatus.replace(/_/g, ' ').toUpperCase()}`,
    type: 'order_update',
    priority: 'info',
    link: '/dashboard/orders'
  });

  revalidatePath('/admin/commerce/mall-orders');
  return { success: true };
}

export async function invoiceMallOrderShipping(orderId: string, amount: number) {
  const supabase = await createClient();
  
  const { data: order, error: fetchError } = await supabase
    .from('ecom_orders')
    .select('customer_id, order_id')
    .eq('id', orderId)
    .single();

  if (fetchError || !order) return { success: false, error: 'Order not found' };

  const { error } = await supabase
    .from('ecom_orders')
    .update({ shipping_cost: amount })
    .eq('id', orderId);

  if (error) return { success: false, error: error.message };

  // Notify User to pay
  await createNotification({
    userId: order.customer_id,
    title: 'Shipping Fee Invoiced',
    message: `A shipping fee of GHS ${amount} has been invoiced for your mall order (${order.order_id}). Please proceed to payment.`,
    type: 'payment_required',
    priority: 'important',
    link: '/dashboard/invoices'
  });

  revalidatePath('/admin/commerce/mall-orders');
  return { success: true };
}

export async function updateMallOrderPaymentStatus(orderId: string, newStatus: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('ecom_orders').update({ payment_status: newStatus }).eq('id', orderId);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/commerce/mall-orders');
  return { success: true };
}

export async function updateMallOrderShippingMethod(orderId: string, newMethod: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('ecom_orders').update({ shipping_method: newMethod }).eq('id', orderId);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/commerce/mall-orders');
  return { success: true };
}

export async function deleteMallOrder(orderId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('ecom_orders').delete().eq('id', orderId);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/commerce/mall-orders');
  return { success: true };
}
