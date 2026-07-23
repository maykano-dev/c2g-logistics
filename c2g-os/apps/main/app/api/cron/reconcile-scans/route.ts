import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 300; // 5 minutes max duration for cron

export async function GET(request: Request) {
  // Optional security check for Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const supabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 1. Get 30-day window
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

    // 2. Fetch all 'not_found' scan logs from the last 30 days
    const { data: unresolvedScans, error: fetchError } = await supabase
      .from('scan_logs')
      .select('id, scanned_tracking, scanned_at')
      .eq('scan_result', 'not_found')
      .gte('scanned_at', thirtyDaysAgoISO)
      .order('scanned_at', { ascending: false });

    if (fetchError) throw fetchError;
    
    if (!unresolvedScans || unresolvedScans.length === 0) {
      return NextResponse.json({ success: true, message: 'No unresolved scans found.' });
    }

    let reconciledCount = 0;

    // 3. Process each unresolved scan log
    for (const scan of unresolvedScans) {
      const tracking = scan.scanned_tracking;
      if (!tracking) continue;
      
      let match: any = null;
      let rpcData: any = {};

      // Check Shipments
      const { data: shipment } = await supabase
        .from('shipments')
        .select('id, status, customer_name')
        .eq('tracking_number', tracking)
        .gte('created_at', thirtyDaysAgoISO)
        .maybeSingle();

      if (shipment) {
        match = shipment;
        rpcData = { type: 'shipment' };
      } else {
        // Check Incoming Packages
        const { data: incoming } = await supabase
          .from('incoming_packages')
          .select('id, status, customer_name')
          .eq('tracking_number', tracking)
          .gte('created_at', thirtyDaysAgoISO)
          .maybeSingle();

        if (incoming) {
          match = incoming;
          rpcData = { type: 'incoming' };
        } else {
          // Check Ecom Orders
          const { data: ecom } = await supabase
            .from('ecom_orders')
            .select('id, status, customer_name')
            .eq('tracking_number', tracking)
            .gte('created_at', thirtyDaysAgoISO)
            .maybeSingle();

          if (ecom) {
            match = ecom;
            rpcData = { type: 'ecom_order' };
          } else {
            // Check Link Orders (fuzzy match on item_tracking_numbers)
            const { data: orders } = await supabase
              .from('orders')
              .select('id, item_tracking_numbers, order_status, customer_name')
              .not('item_tracking_numbers', 'is', null)
              .gte('created_at', thirtyDaysAgoISO);

            if (orders) {
              for (const order of orders) {
                try {
                  const trackingNumbers = typeof order.item_tracking_numbers === 'string' 
                    ? JSON.parse(order.item_tracking_numbers) 
                    : order.item_tracking_numbers;
                  if (Array.isArray(trackingNumbers) && trackingNumbers.includes(tracking)) {
                    match = { ...order, status: order.order_status };
                    rpcData = { type: 'order' };
                    break;
                  }
                } catch (e) { /* ignore */ }
              }
            }
          }
        }
      }

      // 4. If a match is found, reconcile!
      if (match) {
        const isAlreadyProcessed = ['in_warehouse', 'In Warehouse', 'ready_for_pickup', 'completed', 'picked_up', 'arrived_at_warehouse'].includes(match.status || '');
        
        if (!isAlreadyProcessed) {
          // Update the package status
          const tableName = rpcData.type === 'shipment' ? 'shipments' : 
                            rpcData.type === 'incoming' ? 'incoming_packages' : 
                            rpcData.type === 'ecom_order' ? 'ecom_orders' : 'orders';
          
          const statusColumn = tableName === 'orders' ? 'order_status' : 'status';

          await supabase
            .from(tableName)
            .update({ [statusColumn]: 'in_warehouse' })
            .eq('id', match.id);
        }

        // Update the scan log to indicate it's found
        await supabase
          .from('scan_logs')
          .update({
            scan_result: isAlreadyProcessed ? 'already_processed' : 'updated',
            package_type: rpcData.type,
            package_id: match.id.toString(),
            customer_name: match.customer_name || 'Unknown',
            current_status: isAlreadyProcessed ? match.status : 'in_warehouse'
          })
          .eq('id', scan.id);

        reconciledCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      scansChecked: unresolvedScans.length,
      reconciled: reconciledCount
    });

  } catch (error: any) {
    console.error('Reconcile Scans Cron Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
