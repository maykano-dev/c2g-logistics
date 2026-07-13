'use server';

import { createClient } from '@/utils/supabase/server';

export async function getAgentDashboardStats() {
  const supabase = await createClient();

  // 1. Pending Link Orders (awaiting payment)
  const pendingLinkOrdersPromise = supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'link_order')
    .in('payment_status', ['pending', 'awaiting_payment']);

  // 2. Awaiting Procurement (Link Orders in processing)
  const processingLinkOrdersPromise = supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'link_order')
    .eq('order_status', 'processing');

  // 3. Awaiting Procurement (Mall Orders in processing)
  const processingMallOrdersPromise = supabase
    .from('ecom_orders')
    .select('*', { count: 'exact', head: true })
    .eq('order_status', 'processing');

  // 4. Active Reservations
  const activeReservationsPromise = supabase
    .from('shipment_reservations')
    .select('*', { count: 'exact', head: true })
    .not('status', 'in', '("completed","cancelled")');

  // 5. Total Customers
  const totalCustomersPromise = supabase
    .from('customers')
    .select('*', { count: 'exact', head: true });

  // 6. Active Shipments (in transit/clearing)
  const activeShipmentsPromise = supabase
    .from('shipments')
    .select('*', { count: 'exact', head: true })
    .in('status', ['in_transit', 'in-transit', 'shipped', 'clearing_customs', 'arrived_ghana']);

  // 7. Packages in Warehouse (shipments)
  const warehouseShipmentsPromise = supabase
    .from('shipments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'in_warehouse');

  const warehouseOrdersPromise = supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('order_status', 'in_warehouse');

  const warehouseEcomPromise = supabase
    .from('ecom_orders')
    .select('*', { count: 'exact', head: true })
    .eq('order_status', 'in_warehouse');

  // 8. Orders Today (Link + Mall)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const todayLinkOrdersPromise = supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayISO);

  const todayMallOrdersPromise = supabase
    .from('ecom_orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayISO);

  // 9. Live Announcements
  const announcementsPromise = supabase
    .from('announcements')
    .select('*', { count: 'exact', head: true });

  const [
    pendingLinkRes,
    procLinkRes,
    procMallRes,
    reservationsRes,
    customersRes,
    shipmentsRes,
    whShipRes,
    whOrdRes,
    whEcomRes,
    todayLinkRes,
    todayMallRes,
    annRes
  ] = await Promise.all([
    pendingLinkOrdersPromise,
    processingLinkOrdersPromise,
    processingMallOrdersPromise,
    activeReservationsPromise,
    totalCustomersPromise,
    activeShipmentsPromise,
    warehouseShipmentsPromise,
    warehouseOrdersPromise,
    warehouseEcomPromise,
    todayLinkOrdersPromise,
    todayMallOrdersPromise,
    announcementsPromise
  ]);

  return {
    pendingLinkOrders: pendingLinkRes.count || 0,
    processingLinkOrders: procLinkRes.count || 0,
    processingMallOrders: procMallRes.count || 0,
    activeReservations: reservationsRes.count || 0,
    totalCustomers: customersRes.count || 0,
    activeShipments: shipmentsRes.count || 0,
    packagesInWarehouse: (whShipRes.count || 0) + (whOrdRes.count || 0) + (whEcomRes.count || 0),
    ordersToday: (todayLinkRes.count || 0) + (todayMallRes.count || 0),
    liveAnnouncements: annRes.count || 0
  };
}
