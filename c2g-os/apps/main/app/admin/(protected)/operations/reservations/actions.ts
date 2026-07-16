'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateReservationStatus(id: string, status: string) {
  const supabase = await createClient();
  const payload: any = { status };
  if (status === 'in_transit') {
    payload.updated_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('shipment_reservations')
    .update(payload)
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }
  
  revalidatePath('/admin/operations/reservations');
  return { success: true };
}

export async function bulkUpdateReservationStatus(ids: string[], status: string) {
  const supabase = await createClient();
  const payload: any = { status };
  if (status === 'in_transit') {
    payload.updated_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('shipment_reservations')
    .update(payload)
    .in('id', ids);

  if (error) {
    return { success: false, error: error.message };
  }
  
  revalidatePath('/admin/operations/reservations');
  return { success: true };
}

export async function updateAdminReservation(id: string, data: any) {
  const supabase = await createClient();
  
  // Fetch old data to detect if shipping fee is newly invoiced
  const { data: oldRes } = await supabase
    .from('shipment_reservations')
    .select('final_shipping_cost, customer_id')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('shipment_reservations')
    .update(data)
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  // Check if newly invoiced
  if (data.final_shipping_cost && Number(data.final_shipping_cost) > 0) {
    const oldCost = oldRes?.final_shipping_cost ? Number(oldRes.final_shipping_cost) : 0;
    const newCost = Number(data.final_shipping_cost);
    
    if (oldCost !== newCost && oldCost === 0 && oldRes?.customer_id) {
      await supabase.from('notifications').insert({
        user_id: oldRes.customer_id,
        title: 'Shipping Fee Invoiced',
        message: `Your shipping fee for reservation ${id} has been invoiced. The final cost is ₵${newCost.toFixed(2)}. Please pay the fee to avoid delays.`,
        type: 'info'
      });
    }
  }

  // Update tracking number on all shipments linked to this reservation
  if (data.tracking_number) {
    await supabase.from('shipments').update({ tracking_number: data.tracking_number }).eq('reservation_id', id);
  }
  
  revalidatePath('/admin/operations/reservations');
  return { success: true };
}

export async function getReservationItems(id: string) {
  const supabase = await createClient();
  
  const { data: packages, error: pkgError } = await supabase
    .from('shipments')
    .select('id, tracking_number, items_description, total_weight_kg, status')
    .eq('reservation_id', id);

  const { data: linkOrders, error: linkError } = await supabase
    .from('orders')
    .select('id, product_name, notes, order_status')
    .eq('reservation_id', id);

  const { data: mallOrders, error: mallError } = await supabase
    .from('ecom_orders')
    .select('id, order_id, total_amount, order_status, items')
    .eq('reservation_id', id);

  if (pkgError || linkError || mallError) {
    return { success: false, error: 'Failed to fetch items' };
  }

  return {
    success: true,
    data: {
      packages: packages || [],
      linkOrders: linkOrders || [],
      mallOrders: mallOrders || []
    }
  };
}
