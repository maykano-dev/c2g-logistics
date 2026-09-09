import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { getLogisticsTrace } from '@/lib/hiobuy/procurement';
import { createNotification } from '@/utils/notifications';

// Use Edge runtime or Node runtime depending on your environment
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Basic security check (optional, but recommended for cron jobs)
    const authHeader = request.headers.get('authorization');
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Initialize Supabase Service Role Client
    const supabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. Fetch paid ecom_orders that are pending or processing
    const { data: activeOrders, error: fetchError } = await supabase
      .from('ecom_orders')
      .select('id, customer_id, order_id, order_status, items, history')
      .in('payment_status', ['paid', 'Paid'])
      .in('order_status', ['pending', 'processing', 'shipped']);

    if (fetchError) {
      console.error('Failed to fetch active ecom_orders for sync:', fetchError);
      return NextResponse.json({ success: false, error: fetchError.message }, { status: 500 });
    }

    if (!activeOrders || activeOrders.length === 0) {
      return NextResponse.json({ success: true, message: 'No active orders to sync.', processedCount: 0 });
    }

    let processedCount = 0;
    const updatedOrders = [];

    // 4. For each order, fetch procurement_jobs to get outer_purchase_id
    for (const order of activeOrders) {
      const { data: job } = await supabase
        .from('procurement_jobs')
        .select('outer_purchase_id')
        .eq('ecom_order_id', order.id)
        .single();

      if (!job?.outer_purchase_id) {
        continue; // Skip if no HioBuy purchase ID is found
      }

      try {
        const items = Array.isArray(order.items) ? order.items : [];
        const channel = items[0]?.channel || '1688';

        // 5. Query HioBuy Logistics Trace
        const traceRes = await getLogisticsTrace({
          channel: channel as any,
          order_id: job.outer_purchase_id,
        });

        const traceData = traceRes?.data || traceRes;

        // 6. Check if HioBuy returned a tracking number via the packages array
        const packages = traceData?.tracking?.packages || traceData?.packages || [];
        
        // Translate steps if they exist
        if (packages.length > 0 && packages[0].steps) {
          const steps = packages[0].steps;
          await Promise.all(steps.map(async (step: any) => {
            if (step.remark && /[\u4e00-\u9fa5]/.test(step.remark)) {
              try {
                const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(step.remark)}&langpair=zh-CN|en`;
                const tRes = await fetch(url);
                const tData = await tRes.json();
                if (tData?.responseData?.translatedText) {
                  step.translatedRemark = tData.responseData.translatedText;
                }
              } catch (e) {
                console.error("Translation failed on cron for step", e);
              }
            }
          }));
        }

        if (packages.length > 0 && packages[0].tracking_number) {
          const localTrackingNumber = packages[0].tracking_number;
          
          // Check if there are logistics steps indicating shipment has started
          const nodes = packages[0].steps || [];
          if (nodes.length > 0 || localTrackingNumber) {
            
            // Generate updated history
            const currentHistory = Array.isArray(order.history) ? order.history : [];
            const newHistoryEvent = {
              status: 'shipped',
              changed_at: new Date().toISOString(),
              changed_by: 'system_sync'
            };

            // Ensure we don't duplicate the shipped history entry
            const hasShippedEntry = currentHistory.some((h: any) => h.status === 'shipped');
            const newHistory = hasShippedEntry ? currentHistory : [...currentHistory, newHistoryEvent];

            // 7. Update database with tracking number, new status, AND the translated logistics trace!
            const { error: updateError } = await supabase
              .from('ecom_orders')
              .update({
                tracking_number: localTrackingNumber,
                order_status: 'shipped', // Always ensure it is marked shipped
                history: newHistory,
                logistics_trace: traceData // Save the full trace to DB
              })
              .eq('id', order.id);

            if (!updateError) {
              processedCount++;
              updatedOrders.push(order.order_id);

              // 8. Send Push Notification to Customer
              if (order.customer_id) {
                createNotification({
                  userId: order.customer_id,
                  title: 'Order Shipped by Supplier',
                  message: `Your Mall order #${order.order_id} has been shipped by the supplier. Local tracking #: ${localTrackingNumber}. It is now en route to our China warehouse.`,
                  type: 'system',
                  priority: 'info',
                  link: `/dashboard/orders/mall/${order.id}`
                }).catch(e => console.warn('Failed to send notification in cron:', e));
              }
            } else {
               console.error('Failed to update ecom order tracking:', updateError);
            }
          }
        }
      } catch (err) {
        console.error(`Error syncing tracking for order ${order.id}:`, err);
        // Continue loop to process next order
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Sync completed successfully.', 
      processedCount,
      updatedOrders
    });

  } catch (error: any) {
    console.error('Unexpected error in sync cron job:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
