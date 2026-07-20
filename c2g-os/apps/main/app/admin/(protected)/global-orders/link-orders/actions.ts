'use server';

import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createNotification } from '@/utils/notifications';
import { revalidatePath } from 'next/cache';

export async function getAllLinkOrders() {
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin link orders:', error);
    return { success: false, data: [] };
  }
  return { success: true, data };
}

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

export async function updateLinkOrderItemTracking(orderId: number, itemIndex: number, newTracking: string) {
  const supabase = await createClient();
  
  // 1. Fetch the order
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('items, notes, item_tracking_numbers')
    .eq('id', orderId)
    .single();

  if (fetchError || !order) return { success: false, error: 'Order not found' };

  let updatedItems = Array.isArray(order.items) ? [...order.items] : [];
  let updatedNotes = order.notes || '';
  
  // Retroactive Match Check
  let isWarehouseMatch = false;
  if (newTracking) {
    const { data: scanMatch } = await supabase
      .from('scan_logs')
      .select('id')
      .eq('scanned_tracking', newTracking)
      .limit(1)
      .single();
    if (scanMatch) isWarehouseMatch = true;
  }

  let itemsInWarehouseCount = 0;
  let totalItems = 0;

  // Update in items array if it exists there
  if (updatedItems.length > 0) {
    totalItems = updatedItems.length;
    if (updatedItems.length > itemIndex) {
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], tracking_number: newTracking };
      if (isWarehouseMatch) updatedItems[itemIndex].status = 'in_warehouse';
    }
    itemsInWarehouseCount = updatedItems.filter((i: any) => i.status === 'in_warehouse').length;
  }

  // Update in JSON_ITEMS if it exists there
  if (updatedNotes.includes('JSON_ITEMS:')) {
    try {
      const parts = updatedNotes.split('JSON_ITEMS:');
      const parsedItems = JSON.parse(parts[1]);
      if (Array.isArray(parsedItems)) {
        totalItems = parsedItems.length;
        if (parsedItems.length > itemIndex) {
          parsedItems[itemIndex] = { ...parsedItems[itemIndex], tracking_number: newTracking };
          if (isWarehouseMatch) parsedItems[itemIndex].status = 'in_warehouse';
        }
        itemsInWarehouseCount = parsedItems.filter((i: any) => i.status === 'in_warehouse').length;
        updatedNotes = `${parts[0]}JSON_ITEMS:${JSON.stringify(parsedItems)}`;
      }
    } catch (e) {
      console.error('Failed to parse JSON_ITEMS in action', e);
    }
  }

  // Update the global item_tracking_numbers array used by the scanner
  const trackingSet = new Set(order.item_tracking_numbers || []);
  if (newTracking) {
    trackingSet.add(newTracking);
  }
  const newItemTrackingNumbers = Array.from(trackingSet).filter(Boolean);
  
  // Update parent order status if all items are in warehouse
  const parentStatus = (totalItems > 0 && itemsInWarehouseCount === totalItems) ? 'in_warehouse' : undefined;
  
  const updatePayload: any = {
    items: updatedItems,
    notes: updatedNotes,
    item_tracking_numbers: newItemTrackingNumbers
  };
  
  if (parentStatus) {
    updatePayload.order_status = parentStatus;
  }

  const { error } = await supabase
    .from('orders')
    .update(updatePayload)
    .eq('id', orderId);

  if (error) return { success: false, error: error.message };
  
  revalidatePath('/admin/global-orders/link-orders');
  return { success: true };
}
