'use server';

import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createNotification } from '@/utils/notifications';
import { revalidatePath } from 'next/cache';

export async function getAllMallOrders() {
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from('ecom_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin mall orders:', error);
    return { success: false, data: [] };
  }
  return { success: true, data };
}

export async function updateMallOrderStatus(orderId: string, newStatus: string) {
  const supabase = await createClient();
  
  const { data: order, error: fetchError } = await supabase
    .from('ecom_orders')
    .select('customer_id, order_id, customer_name, alibaba_tracking_number')
    .eq('id', orderId)
    .single();

  if (fetchError || !order) return { success: false, error: 'Order not found' };

  // Map UI friendly names back to DB ENUM if needed, but we'll assume the UI sends the right value.
  const { error } = await supabase
    .from('ecom_orders')
    .update({ order_status: newStatus })
    .eq('id', orderId);

  if (error) return { success: false, error: error.message };

  // Retroactive Scan Log Matching when status changes to in_warehouse
  if (newStatus === 'in_warehouse' && order.alibaba_tracking_number) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const tracking = order.alibaba_tracking_number;
    const numericMatch = tracking.match(/\d{6,}/);
    const trackingDigits = numericMatch ? numericMatch[0] : tracking;

    const { data: scanMatch } = await supabase
      .from('scan_logs')
      .select('id, scan_result')
      .or(`scanned_tracking.eq.${tracking},scanned_tracking.ilike.%${trackingDigits}%`)
      .in('scan_result', ['not_found', 'error'])
      .gte('scanned_at', thirtyDaysAgo.toISOString())
      .limit(1)
      .maybeSingle();

    if (scanMatch) {
      await supabase.from('scan_logs').update({
        scan_result: 'updated',
        package_type: 'ecom_order',
        package_id: orderId,
        customer_name: order.customer_name || 'Unknown',
        current_status: 'in_warehouse'
      }).eq('id', scanMatch.id);
    }
  }

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
