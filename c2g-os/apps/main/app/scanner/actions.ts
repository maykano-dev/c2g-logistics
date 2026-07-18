'use server';

import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function processScannedPackage(candidates: string[]) {
  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  try {
    let finalStatus = 'not_found';
    let customerName = 'Unknown';
    let trackingNumberMatched = candidates[0];
    let currentStatus = '';
    let shipmentMatch: any = null;

    let rpcData: any = {};
    let match: any = null;

    // 1. Search across tables for any matching tracking number
    for (const tracking of candidates) {
      // Check Shipments
      const { data: shipment } = await supabase
        .from('shipments')
        .select('id, tracking_number, status, customer_name, items_description')
        .eq('tracking_number', tracking)
        .maybeSingle();
      
      if (shipment) {
        match = shipment;
        rpcData = { type: 'shipment', ...shipment };
        break;
      }
      
      // Check Incoming Packages
      const { data: incoming } = await supabase
        .from('incoming_packages')
        .select('id, tracking_number, status, customer_name, items_description')
        .eq('tracking_number', tracking)
        .maybeSingle();

      if (incoming) {
        match = incoming;
        rpcData = { type: 'incoming', ...incoming };
        break;
      }
      
      // Check Ecom Orders
      const { data: ecom } = await supabase
        .from('ecom_orders')
        .select('id, tracking_number, status, customer_name, items_description')
        .eq('tracking_number', tracking)
        .maybeSingle();

      if (ecom) {
        match = ecom;
        rpcData = { type: 'ecom_order', ...ecom };
        break;
      }
      
      // Check Regular Orders
      const { data: order } = await supabase
        .from('orders')
        .select('id, tracking_number, status, customer_name, items_description')
        .eq('tracking_number', tracking)
        .maybeSingle();

      if (order) {
        match = order;
        rpcData = { type: 'order', ...order };
        break;
      }
    }

    if (match) {
      customerName = match.customer_name || 'Unknown';
      trackingNumberMatched = match.tracking_number || candidates[0];
      currentStatus = match.status || '';
      
      const isAlreadyProcessed = ['in_warehouse', 'In Warehouse', 'ready_for_pickup', 'completed', 'picked_up', 'arrived_at_warehouse'].includes(currentStatus);
      
      if (isAlreadyProcessed) {
        finalStatus = 'already_processed';
      } else {
        finalStatus = 'updated';
        const tableName = rpcData.type === 'shipment' ? 'shipments' : 
                          rpcData.type === 'incoming' ? 'incoming_packages' : 
                          rpcData.type === 'ecom_order' ? 'ecom_orders' : 'orders';
                          
        await supabase
          .from(tableName)
          .update({ status: 'in_warehouse' })
          .eq('id', match.id);
      }

      // Best effort insert to scan logs
      await supabase.from('scan_logs').insert({
        tracking_number: trackingNumberMatched,
        status: finalStatus,
        customer_name: customerName,
        message: `Package type: ${rpcData.type || 'unknown'}, ID: ${match.id || 'none'}`
      });
    } else {
      // Not found
      await supabase.from('scan_logs').insert({
        tracking_number: candidates[0],
        status: 'not_found'
      });
    }

    revalidatePath('/scanner');
    return { success: true, data: { status: finalStatus, customer_name: customerName, current_status: currentStatus, tracking_number: trackingNumberMatched } };
    
  } catch (err: any) {
    console.error('Scan Error:', err);
    return { success: false, error: err.message || 'Server error during scan' };
  }
}
