'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function processScannedPackage(candidates: string[]) {
  const supabase = await createClient();
  
  try {
    let finalStatus = 'not_found';
    let customerName = 'Unknown';
    let trackingNumberMatched = candidates[0];
    let currentStatus = '';

    // 1. Check Orders (Link Orders)
    const { data: orderMatch, error: orderError } = await supabase
      .from('orders')
      .select('id, customer_name, order_status, items, notes, item_tracking_numbers')
      .overlaps('item_tracking_numbers', candidates)
      .limit(1)
      .single();

    if (orderMatch && !orderError) {
      customerName = orderMatch.customer_name || 'Unknown';
      trackingNumberMatched = candidates.find(c => orderMatch.item_tracking_numbers.includes(c)) || candidates[0];
      
      // Update item logic inside order
      let updatedItems = Array.isArray(orderMatch.items) ? [...orderMatch.items] : [];
      let updatedNotes = orderMatch.notes || '';
      let itemWasAlreadyInWarehouse = false;
      let itemsInWarehouseCount = 0;
      let totalItems = 0;

      // Update in items array
      if (updatedItems.length > 0) {
        totalItems = updatedItems.length;
        updatedItems = updatedItems.map((item: any) => {
          if (item.tracking_number === trackingNumberMatched) {
            if (item.status === 'in_warehouse') {
              itemWasAlreadyInWarehouse = true;
            }
            item.status = 'in_warehouse';
          }
          if (item.status === 'in_warehouse') itemsInWarehouseCount++;
          return item;
        });
      }

      // Update in JSON_ITEMS if present
      if (updatedNotes.includes('JSON_ITEMS:')) {
        try {
          const parts = updatedNotes.split('JSON_ITEMS:');
          const parsedItems = JSON.parse(parts[1]);
          if (Array.isArray(parsedItems)) {
            totalItems = parsedItems.length;
            itemsInWarehouseCount = 0; // reset
            const newParsedItems = parsedItems.map((item: any) => {
              if (item.tracking_number === trackingNumberMatched) {
                if (item.status === 'in_warehouse') itemWasAlreadyInWarehouse = true;
                item.status = 'in_warehouse';
              }
              if (item.status === 'in_warehouse') itemsInWarehouseCount++;
              return item;
            });
            updatedNotes = `${parts[0]}JSON_ITEMS:${JSON.stringify(newParsedItems)}`;
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (itemWasAlreadyInWarehouse) {
        finalStatus = 'already_processed';
        currentStatus = 'in_warehouse';
      } else {
        finalStatus = 'updated';
        
        // Check if all items are in warehouse to update parent order status
        const parentStatus = (totalItems > 0 && itemsInWarehouseCount === totalItems) ? 'in_warehouse' : orderMatch.order_status;

        await supabase.from('orders').update({
          items: updatedItems,
          notes: updatedNotes,
          order_status: parentStatus
        }).eq('id', orderMatch.id);
      }
    } else {
      // 2. Check Shipments
      // We use .in() for arrays in Supabase JS to check if a column matches any in an array
      // Wait, we need to find a shipment where tracking_number is in candidates
      const { data: shipmentMatch, error: shipmentError } = await supabase
        .from('shipments')
        .select('id, tracking_number, customer_name, status')
        .in('tracking_number', candidates)
        .limit(1)
        .single();

      if (shipmentMatch && !shipmentError) {
        customerName = shipmentMatch.customer_name || 'Unknown';
        trackingNumberMatched = shipmentMatch.tracking_number;

        if (['in_warehouse', 'arrived_at_warehouse', 'processing'].includes(shipmentMatch.status)) {
          finalStatus = 'already_processed';
          currentStatus = shipmentMatch.status;
        } else {
          finalStatus = 'updated';
          await supabase.from('shipments').update({ status: 'in_warehouse' }).eq('id', shipmentMatch.id);
        }
      }
    }

    // 3. Log to scan_logs table permanently
    let message = '';
    if (finalStatus === 'updated') message = 'Package marked as IN WAREHOUSE';
    else if (finalStatus === 'already_processed') message = `Already processed (${currentStatus})`;
    else message = 'Package not found in database';

    // Best effort insert to scan logs
    await supabase.from('scan_logs').insert({
      scanned_tracking: trackingNumberMatched,
      scan_result: finalStatus,
      customer_name: customerName,
      package_type: orderMatch ? 'link_order' : (shipmentMatch ? 'shipment' : null),
      package_id: orderMatch ? orderMatch.id : (shipmentMatch ? shipmentMatch.id : null),
      current_status: currentStatus || null,
      items_description: orderMatch ? 'Link Order' : (shipmentMatch ? 'Shipment' : null)
    });

    revalidatePath('/scanner');
    return { success: true, data: { status: finalStatus, customer_name: customerName, current_status: currentStatus, tracking_number: trackingNumberMatched } };
    
  } catch (err: any) {
    console.error('Scan Error:', err);
    return { success: false, error: err.message || 'Server error during scan' };
  }
}
