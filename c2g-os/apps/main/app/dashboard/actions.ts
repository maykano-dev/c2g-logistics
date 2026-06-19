'use server'

import { createClient } from '@/utils/supabase/server'

export async function getDashboardStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // Fetch user name
  const { data: customerData } = await supabase
    .from('customers')
    .select('name')
    .eq('id', user.id)
    .single()
    
  const userName = customerData?.name ? customerData.name.split(' ')[0] : 'there'

  // 1. Orders in Transit (shipped, arrived_ghana, clearing_customs)
  const { count: transitOrdersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('customer_id', user.id)
    .in('order_status', ['shipped', 'arrived_ghana', 'clearing_customs'])

  // 2. Ready for Pickup (orders + shipments)
  const { count: pickupOrdersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('customer_id', user.id)
    .eq('order_status', 'ready_for_pickup')
    
  const { count: pickupShipmentsCount } = await supabase
    .from('shipments')
    .select('*', { count: 'exact', head: true })
    .eq('customer_id', user.id)
    .in('status', ['ready_for_pickup', 'ready-for-pickup'])

  // 3. Total Mall Orders
  const { count: mallOrdersCount } = await supabase
    .from('ecom_orders')
    .select('*', { count: 'exact', head: true })
    .eq('customer_id', user.id)

  // 4. Pending Payments (orders + ecom_orders)
  const { count: pendingOrdersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('customer_id', user.id)
    .eq('payment_status', 'pending')

  const { count: pendingEcomCount } = await supabase
    .from('ecom_orders')
    .select('*', { count: 'exact', head: true })
    .eq('customer_id', user.id)
    .in('payment_status', ['pending', 'awaiting_payment'])

  // 5. Active Shipments (in transit, clearing)
  const { count: activeShipmentsCount } = await supabase
    .from('shipments')
    .select('*', { count: 'exact', head: true })
    .eq('customer_id', user.id)
    .in('status', ['in_transit', 'in-transit', 'shipped', 'clearing_customs'])

  // 6. In Warehouse (shipments)
  const { count: inWarehouseCount } = await supabase
    .from('shipments')
    .select('*', { count: 'exact', head: true })
    .eq('customer_id', user.id)
    .eq('status', 'in_warehouse')

  // 7. Incoming Packages (from shipments table)
  const { count: incomingPackagesCount } = await supabase
    .from('shipments')
    .select('*', { count: 'exact', head: true })
    .eq('customer_id', user.id)
    .in('status', ['pending', 'awaiting_arrival', 'pending_payment'])

  // 8. Link Orders
  const { count: linkOrdersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('customer_id', user.id)
    .eq('type', 'link_order')

  return {
    transitOrdersCount: transitOrdersCount || 0,
    readyForPickupCount: (pickupOrdersCount || 0) + (pickupShipmentsCount || 0),
    mallOrdersCount: mallOrdersCount || 0,
    pendingPaymentsCount: (pendingOrdersCount || 0) + (pendingEcomCount || 0),
    activeShipmentsCount: activeShipmentsCount || 0,
    inWarehouseCount: inWarehouseCount || 0,
    incomingPackagesCount: incomingPackagesCount || 0,
    linkOrdersCount: linkOrdersCount || 0,
    userName,
  }
}

export async function getRecentActivity() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  // Fetch recent updates from the 3 primary tables
  const [orders, shipments, ecomOrders] = await Promise.all([
    supabase.from('orders').select('id, product_name, order_status, updated_at, created_at').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(3),
    supabase.from('shipments').select('id, tracking_number, status, updated_at, created_at').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(3),
    supabase.from('ecom_orders').select('id, order_number, order_status, updated_at, created_at').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(3)
  ]);

  const activities: any[] = [];

  if (orders.data) {
    orders.data.forEach(o => {
      activities.push({
        id: `order-${o.id}`,
        type: 'order',
        title: `Link Order Updated`,
        message: `${o.product_name || 'Items'} is now ${o.order_status?.replace(/_/g, ' ') || 'Pending'}`,
        created_at: o.updated_at || o.created_at
      });
    });
  }

  if (shipments.data) {
    shipments.data.forEach(s => {
      activities.push({
        id: `shipment-${s.id}`,
        type: 'package',
        title: `Package Status Changed`,
        message: `Tracking ${s.tracking_number} is now ${s.status?.replace(/_/g, ' ') || 'Pending'}`,
        created_at: s.updated_at || s.created_at
      });
    });
  }

  if (ecomOrders.data) {
    ecomOrders.data.forEach(e => {
      activities.push({
        id: `ecom-${e.id}`,
        type: 'mall',
        title: `Mall Order Update`,
        message: `Order #${e.order_number} is now ${e.order_status?.replace(/_/g, ' ') || 'Pending'}`,
        created_at: e.updated_at || e.created_at
      });
    });
  }

  // Sort combined activities by timestamp descending
  activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Return the top 5 most recent
  return activities.slice(0, 5);
}
