'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateReservationStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('shipment_reservations')
    .update({ status })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }
  
  revalidatePath('/admin/operations/reservations');
  return { success: true };
}

export async function bulkUpdateReservationStatus(ids: string[], status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('shipment_reservations')
    .update({ status })
    .in('id', ids);

  if (error) {
    return { success: false, error: error.message };
  }
  
  revalidatePath('/admin/operations/reservations');
  return { success: true };
}

export async function updateAdminReservation(id: string, data: any) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('shipment_reservations')
    .update(data)
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
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
