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
    .select('first_name')
    .eq('id', user.id)
    .single()
    
  const userName = customerData?.first_name || 'there'

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

  // Ideally this queries a unified 'notification_log' or 'order_status_history'.
  // For now, we'll fetch recent notifications.
  const { data: activities } = await supabase
    .from('notifications')
    .select('id, type, title, message, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return activities || []
}
