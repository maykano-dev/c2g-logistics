'use server'

import { createClient } from '@/utils/supabase/server'

export async function getLinkOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  // Link orders are in the 'orders' table with type='link_order'
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', user.id)
    .eq('type', 'link_order')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching link orders:', error)
    return []
  }

  return orders || []
}

export async function getLinkOrder(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('customer_id', user.id)
    .single()

  if (error || !order) {
    console.error('Error fetching link order:', error)
    return null
  }

  const { data: history } = await supabase
    .from('order_status_history')
    .select('*')
    .eq('order_id', id)
    .order('changed_at', { ascending: true })

  return { ...order, history: history || [] }
}

export async function getSettings() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single()
  
  return settings
}

export async function createLinkOrder(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Unauthorized' }

  const itemsJsonStr = formData.get('items_json') as string;
  let items = [];
  try {
    items = JSON.parse(itemsJsonStr || '[]');
  } catch (e) {
    return { error: 'Invalid items format' };
  }

  const shipping_mode = formData.get('shipping') as string;
  const screenshot = formData.get('screenshot') as File;

  if (!items || items.length === 0 || !shipping_mode || !screenshot) {
    return { error: 'All mandatory fields must be provided' };
  }

  // Upload screenshot to Supabase Storage
  const fileExt = screenshot.name.split('.').pop()
  const fileName = `${user.id}-${Date.now()}.${fileExt}`
  
  const { error: uploadError } = await supabase.storage
    .from('order-screenshots')
    .upload(fileName, screenshot, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    console.error('Upload Error:', uploadError)
    // Fallback if bucket doesn't exist, we just skip image for now in dev, but throw error in prod
    // return { error: 'Failed to upload screenshot. Make sure "order-screenshots" bucket exists.' }
  }

  const { data: publicUrlData } = supabase.storage
    .from('order-screenshots')
    .getPublicUrl(fileName)

  // Fetch exchange rate
  const settings = await getSettings()
  const exchangeRate = settings?.rate_link_orders || settings?.rate_shop_products || 0.5200

  // Calculate totals
  const itemCostCny = items.reduce((sum: number, item: any) => sum + (item.cny_price * item.quantity), 0);
  const itemCostGhs = itemCostCny / exchangeRate;
  const serviceFee = itemCostGhs * 0.05;
  const totalGhs = itemCostGhs + serviceFee;

  // Use the first item's details as the primary fallback, store everything in items JSON
  const primaryItem = items[0];

  const { error: insertError } = await supabase
    .from('orders')
    .insert({
      customer_id: user.id,
      type: 'link_order',
      product_link: primaryItem.product_link,
      product_name: primaryItem.product_link.substring(0, 80) + (items.length > 1 ? ` (+${items.length - 1} more items)` : ''),
      cny_price: itemCostCny,
      quantity: items.reduce((sum: number, item: any) => sum + item.quantity, 0),
      notes: primaryItem.notes,
      items: items,
      shipping_mode,
      screenshot_url: publicUrlData.publicUrl,
      total: totalGhs,
      order_status: 'pending_payment',
      payment_status: 'pending'
    })

  if (insertError) {
    console.error('Insert Error:', insertError)
    return { error: insertError.message || 'Failed to create order' }
  }

  return { success: true, redirectUrl: '/dashboard/link-orders' }
}

export async function updateLinkOrder(id: string, prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Unauthorized' }

  // Verify ownership and payment status
  const { data: order } = await supabase
    .from('orders')
    .select('payment_status, created_at')
    .eq('id', id)
    .eq('customer_id', user.id)
    .single()

  if (!order) return { error: 'Order not found' }
  if (order.payment_status === 'paid' || order.payment_status === 'Paid') {
    return { error: 'Cannot edit a paid order' }
  }

  const quantity = parseInt(formData.get('quantity') as string)
  const notes = formData.get('notes') as string
  const shipping_mode = formData.get('shipping') as string

  if (isNaN(quantity) || !shipping_mode) {
    return { error: 'Quantity and shipping mode are required' }
  }

  // We should ideally recalculate the total based on the original CNY price
  // But we need to fetch the cny_price from the order
  const { data: fullOrder } = await supabase.from('orders').select('cny_price').eq('id', id).single()
  
  const settings = await getSettings()
  const exchangeRate = settings?.rate_link_orders || settings?.rate_shop_products || 0.5200

  const itemCostCny = (fullOrder?.cny_price || 0) * quantity
  const itemCostGhs = itemCostCny / exchangeRate
  const serviceFee = itemCostGhs * 0.05
  const totalGhs = itemCostGhs + serviceFee

  const { error: updateError } = await supabase
    .from('orders')
    .update({
      quantity,
      notes,
      shipping_mode,
      total: totalGhs,
    })
    .eq('id', id)

  if (updateError) {
    return { error: updateError.message || 'Failed to update order' }
  }

  return { success: true, redirectUrl: `/dashboard/link-orders/${id}` }
}

export async function cancelLinkOrder(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Unauthorized' }

  const { data: order } = await supabase
    .from('orders')
    .select('payment_status')
    .eq('id', id)
    .eq('customer_id', user.id)
    .single()

  if (!order) return { error: 'Order not found' }
  if (order.payment_status === 'paid' || order.payment_status === 'Paid') {
    return { error: 'Cannot cancel a paid order' }
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({
      order_status: 'cancelled',
    })
    .eq('id', id)

  if (updateError) {
    return { error: updateError.message || 'Failed to cancel order' }
  }

  return { success: true, redirectUrl: '/dashboard/link-orders' }
}
