'use server';

import { createClient } from '@/utils/supabase/server';
import { createNotification } from '@/utils/notifications';
import { revalidatePath } from 'next/cache';

export async function updateShipmentStatus(shipmentId: string, newStatus: string) {
  const supabase = await createClient();
  
  // Get current shipment details to find user
  const { data: shipment, error: fetchError } = await supabase
    .from('shipments')
    .select('customer_id, tracking_number')
    .eq('id', shipmentId)
    .single();

  if (fetchError || !shipment) {
    return { success: false, error: 'Shipment not found' };
  }

  const { error: updateError } = await supabase
    .from('shipments')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', shipmentId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Trigger Notification
  await createNotification({
    userId: shipment.customer_id,
    title: 'Shipment Update',
    message: `Your shipment (${shipment.tracking_number}) status is now: ${newStatus}`,
    type: 'shipment_update',
    priority: 'info',
    link: '/dashboard/shipments'
  });

  revalidatePath('/admin/operations/shipments');
  return { success: true };
}

export async function bulkUpdateShipmentStatus(shipmentIds: string[], newStatus: string) {
  const supabase = await createClient();
  
  // Need to get all customer IDs to notify them
  const { data: shipments } = await supabase
    .from('shipments')
    .select('id, customer_id, tracking_number')
    .in('id', shipmentIds);

  const { error } = await supabase
    .from('shipments')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .in('id', shipmentIds);

  if (error) {
    return { success: false, error: error.message };
  }

  // Notify all affected users
  if (shipments) {
    const notifyPromises = shipments.map(s => 
      createNotification({
        userId: s.customer_id,
        title: 'Shipment Update',
        message: `Your shipment (${s.tracking_number}) status is now: ${newStatus}`,
        type: 'shipment_update',
        priority: 'info',
        link: '/dashboard/shipments'
      })
    );
    await Promise.allSettled(notifyPromises);
  }

  revalidatePath('/admin/operations/shipments');
  return { success: true };
}

export async function createAdminShipment(data: {
  tracking_number: string;
  customer_name: string;
  customer_unique_id: string;
  method: string;
  total_weight_kg?: number;
  shipping_cost?: number;
  status: string;
}) {
  const supabase = await createClient();
  
  // Admin is manually creating a shipment. We need to find the user ID based on unique ID or name
  // Note: For real system, it's better to fetch user_id. Here we attempt to find it or fallback.
  // Actually, we should fetch customer_id from customers table using the unique_id.
  let customer_id = '00000000-0000-0000-0000-000000000000'; // fallback
  if (data.customer_unique_id) {
    const { data: customerData } = await supabase
      .from('customers')
      .select('user_id')
      .eq('c2g_id', data.customer_unique_id)
      .single();
    if (customerData?.user_id) {
      customer_id = customerData.user_id;
    }
  }

  const insertData = {
    tracking_number: data.tracking_number,
    customer_name: data.customer_name,
    customer_unique_id: data.customer_unique_id,
    customer_id: customer_id,
    method: data.method,
    total_weight_kg: data.total_weight_kg || 0,
    shipping_cost: data.shipping_cost || 0,
    status: data.status || 'Pending',
    registration_fee_paid: true, // Auto marked as paid as requested
    shipping_fee_paid: true,     // Auto marked as paid
    created_at: new Date().toISOString()
  };

  const { data: newRecord, error } = await supabase
    .from('shipments')
    .insert(insertData)
    .select('id, tracking_number')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  if (customer_id !== '00000000-0000-0000-0000-000000000000') {
    await createNotification({
      userId: customer_id,
      title: 'New Shipment Added',
      message: `A new shipment (${data.tracking_number}) has been registered to your account.`,
      type: 'shipment_update',
      priority: 'info',
      link: '/dashboard/shipments'
    });
  }

  revalidatePath('/admin/operations/shipments');
  return { success: true };
}

export async function updateAdminShipment(id: string, data: any) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('shipments')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/operations/shipments');
  return { success: true };
}
