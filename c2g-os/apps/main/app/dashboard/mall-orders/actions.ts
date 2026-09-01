"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

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

  // 2. Process payment atomically using the new RPC
  const { data, error } = await supabase.rpc('pay_mall_order_atomic', {
    p_customer_id: user.id,
    p_order_id: order.id,
    p_amount: Math.abs(parseFloat(order.total_amount)),
    p_reference_id: order.order_id
  });

  if (error || !data || data.success === false) {
    console.error('Error in atomic mall order payment:', error || data?.error);
    if (error?.message?.includes('unique constraint') || data?.error?.includes('unique constraint')) {
      return { success: false, error: 'This transaction is already being processed. Please refresh.' };
    }
    return { success: false, error: data?.error || error?.message || 'Failed to process payment' };
  }

  createNotification({
    userId: user.id,
    title: 'Mall Order Paid',
    message: `Your payment of ₵${Math.abs(parseFloat(order.total_amount)).toFixed(2)} for Mall Order #${order.order_id} was successful. We will begin processing it shortly.`,
    type: 'mall_order_paid',
    priority: 'important',
    link: `/dashboard/mall-orders/${order.id}`
  }).catch(e => console.warn('Failed to dispatch notification:', e));

  revalidatePath('/dashboard', 'layout');
  return { success: true };
}

import { getLogisticsTrace } from "@/lib/hiobuy/procurement";

export async function fetchOrderTrackingTimeline(orderId: string) {
  const supabase = await createClient();
  
  const { data: order, error } = await supabase
    .from("ecom_orders")
    .select("order_status, history, items, created_at, payment_status")
    .eq("id", orderId)
    .single();
    
  if (error || !order) return { success: false, error: "Order not found" };

  const { data: job } = await supabase
    .from("procurement_jobs")
    .select("outer_purchase_id")
    .eq("ecom_order_id", orderId)
    .single();

  let hiobuyTrace = null;
  
  if (job?.outer_purchase_id) {
    try {
      const items = Array.isArray(order.items) ? order.items : [];
      const channel = items[0]?.channel || "1688";
      
      const traceRes = await getLogisticsTrace({
        channel: channel as any,
        order_id: job.outer_purchase_id
      });
      hiobuyTrace = traceRes;
    } catch (e) {
      console.error("Failed to fetch hiobuy trace", e);
    }
  }

  return { 
    success: true, 
    localHistory: order.history || [], 
    hiobuyTrace,
    order_status: order.order_status,
    payment_status: order.payment_status,
    created_at: order.created_at
  };
}
