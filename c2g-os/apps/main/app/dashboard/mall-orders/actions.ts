"use server";

import { createClient } from "@/utils/supabase/server";

export async function getMallOrders() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("ecom_orders")
    .select("*")
    .eq("customer_id", authData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching mall orders:", error);
    return { success: false, error: error.message };
  }

  return { success: true, orders: data };
}

export async function getMallOrder(id: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("ecom_orders")
    .select("*")
    .eq("id", id)
    .eq("customer_id", authData.user.id)
    .single();

  if (error || !data) {
    console.error("Error fetching mall order:", error);
    return null;
  }

  return data;
}

export async function deleteMallOrder(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized' };

  // Verify it's unpaid
  const { data: order } = await supabase
    .from('ecom_orders')
    .select('payment_status')
    .eq('id', id)
    .eq('customer_id', user.id)
    .single();
    
  if (!order) return { error: 'Order not found' };
  if (order.payment_status === 'paid' || order.payment_status === 'Paid') {
    return { error: 'Cannot delete a paid order' };
  }

  const { error } = await supabase
    .from('ecom_orders')
    .delete()
    .eq('id', id)
    .eq('customer_id', user.id);

  if (error) {
    console.error('Error deleting order:', error);
    return { error: 'Failed to delete order' };
  }

  return { success: true };
}

import { deductFromWallet } from '../wallet/actions';
import { createNotification } from '@/utils/notifications';

export async function payMallOrder(orderId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // 1. Fetch order
  const { data: order } = await supabase
    .from('ecom_orders')
    .select('id, total_amount, payment_status, order_id')
    .eq('id', orderId)
    .eq('customer_id', user.id)
    .single();

  if (!order) return { success: false, error: 'Order not found' };
  if (order.payment_status === 'paid' || order.payment_status === 'Paid') {
    return { success: false, error: 'Order is already paid' };
  }
  if (!order.total_amount || parseFloat(order.total_amount) <= 0) {
    return { success: false, error: 'Invalid order total' };
  }

  // 2. Deduct from wallet
  const amount = parseFloat(order.total_amount);
  const deductRes = await deductFromWallet(amount, 'mall_order', `Payment for Mall Order #${order.order_id}`, order.id);

  if (!deductRes.success) {
    return { success: false, error: deductRes.error || 'Failed to deduct from wallet' };
  }

  // 3. Update order status
  const { error: updateError } = await supabase
    .from('ecom_orders')
    .update({
      payment_status: 'paid',
      order_status: 'processing'
    })
    .eq('id', order.id);

  if (updateError) {
    console.error('Error updating mall order after wallet payment:', updateError);
    return { success: false, error: 'Failed to update order status, but wallet was deducted. Please contact support.' };
  }

  createNotification({
    userId: user.id,
    title: 'Mall Order Paid',
    message: `Your payment of ₵${amount.toFixed(2)} for Mall Order #${order.order_id} was successful. We will begin processing it shortly.`,
    type: 'mall_order_paid',
    priority: 'important',
    link: `/dashboard/mall-orders/${order.id}`
  }).catch(e => console.warn('Failed to dispatch notification:', e));

  return { success: true };
}
