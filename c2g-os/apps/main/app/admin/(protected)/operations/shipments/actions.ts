'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
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
    .update({ status: newStatus })
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
    .update({ status: newStatus })
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

  // Retroactive Scan Log Matching: check if this tracking was previously scanned as not_found
  if (data.tracking_number && newRecord) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const numericMatch = data.tracking_number.match(/\d{6,}/);
    const trackingDigits = numericMatch ? numericMatch[0] : data.tracking_number;

    const { data: scanMatch } = await supabase
      .from('scan_logs')
      .select('id, scan_result')
      .or(`scanned_tracking.eq.${data.tracking_number},scanned_tracking.ilike.%${trackingDigits}%`)
      .in('scan_result', ['not_found', 'error'])
      .gte('scanned_at', thirtyDaysAgo.toISOString())
      .limit(1)
      .maybeSingle();

    if (scanMatch) {
      await supabase.from('scan_logs').update({
        scan_result: 'updated',
        package_type: 'shipment',
        package_id: newRecord.id,
        customer_name: data.customer_name,
        current_status: 'in_warehouse'
      }).eq('id', scanMatch.id);

      // Also update the shipment status to in_warehouse since it was already scanned
      await supabase.from('shipments').update({ status: 'in_warehouse' }).eq('id', newRecord.id);
    }
  }

  revalidatePath('/admin/operations/shipments');
  return { success: true };
}

export async function updateAdminShipment(id: string, data: any) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('shipments')
    .update({ ...data })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  // Retroactive Scan Log Matching when tracking number is updated
  if (data.tracking_number) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const numericMatch = data.tracking_number.match(/\d{6,}/);
    const trackingDigits = numericMatch ? numericMatch[0] : data.tracking_number;

    const { data: scanMatch } = await supabase
      .from('scan_logs')
      .select('id, scan_result')
      .or(`scanned_tracking.eq.${data.tracking_number},scanned_tracking.ilike.%${trackingDigits}%`)
      .in('scan_result', ['not_found', 'error'])
      .gte('scanned_at', thirtyDaysAgo.toISOString())
      .limit(1)
      .maybeSingle();

    if (scanMatch) {
      // Fetch customer name for the log
      const { data: shipment } = await supabase.from('shipments').select('customer_name').eq('id', id).single();
      
      await supabase.from('scan_logs').update({
        scan_result: 'updated',
        package_type: 'shipment',
        package_id: id,
        customer_name: shipment?.customer_name || data.customer_name || 'Unknown',
        current_status: 'in_warehouse'
      }).eq('id', scanMatch.id);

      // Auto-update shipment status to in_warehouse
      if (!data.status) {
        await supabase.from('shipments').update({ status: 'in_warehouse' }).eq('id', id);
      }
    }
  }

  revalidatePath('/admin/operations/shipments');
  return { success: true };
}

export async function getAdminShipments() {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('shipments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin shipments:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
