import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createNotification } from '@/utils/notifications';

// This endpoint should be protected by a cron secret
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  const results: any = {
    unpaid_packages: 0,
    unpaid_orders: 0,
    inactive_users: 0,
    errors: []
  };

  try {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    // 1. UNPAID PACKAGE HANDLING FEES (> 24 hours old)
    const { data: unpaidPackages, error: pkgError } = await supabase
      .from('shipments')
      .select('id, customer_id, tracking_number, created_at')
      .eq('registration_fee_paid', false)
      .lte('created_at', twentyFourHoursAgo.toISOString())
      .gte('created_at', fortyEightHoursAgo.toISOString()); // don't spam them forever every 24h

    if (pkgError) throw pkgError;

    for (const pkg of unpaidPackages || []) {
      // Check if we already sent a reminder for this specific package recently
      const { data: existing } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', pkg.customer_id)
        .eq('type', 'reminder_unpaid_package')
        .contains('metadata', { package_id: pkg.id });

      if (!existing || existing.length === 0) {
        await createNotification({
          userId: pkg.customer_id,
          title: 'Unpaid Package Registration',
          message: `📦 You registered package ${pkg.tracking_number} but haven't paid the handling fee yet. Your package will not be monitored until payment is completed.`,
          type: 'reminder_unpaid_package',
          priority: 'critical',
          link: `/dashboard/packages`,
          metadata: { package_id: pkg.id, sent_from: 'cron_growth_engine' }
        });
        results.unpaid_packages++;
      }
    }

    // 2. UNPAID LINK ORDERS (> 24 hours old)
    const { data: unpaidOrders, error: orderError } = await supabase
      .from('orders')
      .select('id, customer_id, created_at, type')
      .eq('payment_status', 'pending')
      .eq('type', 'link_order')
      .lte('created_at', twentyFourHoursAgo.toISOString())
      .gte('created_at', fortyEightHoursAgo.toISOString());

    if (orderError) throw orderError;

    for (const order of unpaidOrders || []) {
      const { data: existing } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', order.customer_id)
        .eq('type', 'reminder_unpaid_order')
        .contains('metadata', { order_id: order.id });

      if (!existing || existing.length === 0) {
        const orderShortId = order.id.toString().split('-').pop()?.substring(0,8);
        await createNotification({
          userId: order.customer_id,
          title: 'Unpaid Link Order',
          message: `🛒 Your order #${orderShortId} is waiting for payment. Complete payment now so we can begin purchasing your items before prices change.`,
          type: 'reminder_unpaid_order',
          priority: 'critical',
          link: `/dashboard/orders/${order.id}`,
          metadata: { order_id: order.id, sent_from: 'cron_growth_engine' }
        });
        results.unpaid_orders++;
      }
    }

    // 3. INACTIVE USERS / MARKETING (Signed up > 7 days ago, 0 packages, 0 orders)
    // For this, we'll fetch users created exactly 7-8 days ago to avoid spamming the entire DB every day.
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

    const { data: newCustomers, error: custError } = await supabase
      .from('customers')
      .select('id, created_at')
      .lte('created_at', sevenDaysAgo.toISOString())
      .gte('created_at', eightDaysAgo.toISOString());

    if (custError) throw custError;

    for (const customer of newCustomers || []) {
      // Check if they have orders
      const { count: orderCount } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('customer_id', customer.id);
        
      const { count: pkgCount } = await supabase
        .from('shipments')
        .select('id', { count: 'exact', head: true })
        .eq('customer_id', customer.id);

      if ((orderCount || 0) === 0 && (pkgCount || 0) === 0) {
        const { data: existing } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', customer.id)
          .eq('type', 'marketing_no_orders_7d');

        if (!existing || existing.length === 0) {
          await createNotification({
            userId: customer.id,
            title: 'Account Created But No Orders',
            message: `🎯 Welcome to C2G! Place your first order or register a package today and experience stress-free importation from China.`,
            type: 'marketing_no_orders_7d',
            priority: 'marketing',
            link: `/dashboard/orders/new`,
            metadata: { sent_from: 'cron_growth_engine' }
          });
          results.inactive_users++;
        }
      }
    }

    return NextResponse.json({ success: true, results });

  } catch (err: any) {
    console.error('Growth engine cron error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
