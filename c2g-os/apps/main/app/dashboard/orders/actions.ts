'use server'

import { createClient } from '@/utils/supabase/server'
import { CreateLinkOrderSchema, UpdateLinkOrderSchema } from '@/utils/security-schemas'
import { uploadImage } from '@/utils/image-service'
import { deductFromWallet } from '../wallet/actions'
import { createNotification } from '@/utils/notifications'

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

export async function getMallOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data: orders, error } = await supabase
    .from('ecom_orders')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching mall orders:', error)
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

import { getCachedSettings } from '@/utils/cache'

export async function getSettings() {
  return await getCachedSettings()
}

export async function createLinkOrder(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Unauthorized' }

  const itemsJsonStr = formData.get('items_json') as string;
  const shipping_mode = formData.get('shipping') as string;

  const validation = CreateLinkOrderSchema.safeParse({
    items_json: itemsJsonStr,
    shipping_mode,
  });

  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || 'Validation failed' };
  }

  let items = JSON.parse(itemsJsonStr);

  // Upload screenshots for each item
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const screenshot = formData.get(`screenshot_${item.id}`) as File | null;
    
    if (!screenshot || screenshot.size === 0) {
      return { error: `Screenshot is required for item ${i + 1}` };
    }

    const fileBuffer = Buffer.from(await screenshot.arrayBuffer());
    const uploadResult = await uploadImage(fileBuffer, screenshot.name);

    if (!uploadResult.success || !uploadResult.url) {
      console.error('Upload Error:', uploadResult.error)
      return { error: `Failed to upload screenshot for item ${i + 1}: ${uploadResult.error || 'Unknown error'}` }
    }

    item.screenshot_url = uploadResult.url;
  }

  // Fetch exchange rate and admin fees
  const settings = await getSettings()
  const exchangeRate = settings?.rate_link_orders || settings?.rate_shop_products || 0.5200
  const serviceFeePercentage = settings?.service_fee_percentage != null ? settings.service_fee_percentage / 100 : 0.15;
  const minServiceFee = settings?.minimum_service_fee || 5;
  const localDeliveryPercentage = settings?.local_delivery_percentage != null ? settings.local_delivery_percentage / 100 : 0;
  const minLocalDeliveryFee = settings?.minimum_local_delivery_fee || 0;

  // Calculate totals securely on the server
  const itemCostCny = items.reduce((sum: number, item: any) => sum + (item.cny_price * item.quantity), 0);
  const itemCostGhs = itemCostCny / exchangeRate;
  
  const calculatedServiceFee = itemCostGhs * serviceFeePercentage;
  const serviceFee = Math.max(calculatedServiceFee, minServiceFee);

  const calculatedLocalDelivery = itemCostGhs * localDeliveryPercentage;
  const localDelivery = Math.max(calculatedLocalDelivery, minLocalDeliveryFee);

  const totalGhs = itemCostGhs + serviceFee + localDelivery;

  // Use the first item's details as the primary fallback, store everything in items JSON
  const primaryItem = items[0];

  // Generate Payment Reference
  const payment_reference = `C2G-ORDER-${Date.now()}`;

  // Fetch Customer Details
  const { data: customer } = await supabase
    .from('customers')
    .select('name, email, phone')
    .eq('id', user.id)
    .single();

  // Map UI shipping mode to Database constraint
  const db_shipping_mode = shipping_mode === 'normal' ? 'air_normal' : 
                           shipping_mode === 'express' ? 'air_express' : 
                           shipping_mode;

  // Insert Order FIRST so it is saved even if payment fails
  const { data: newOrder, error: insertError } = await supabase
    .from('orders')
    .insert({
      customer_id: user.id,
      customer_name: customer?.name || user.email,
      type: 'link_order',
      product_link: primaryItem.product_link,
      product_name: primaryItem.product_link.substring(0, 80) + (items.length > 1 ? ` (+${items.length - 1} more items)` : ''),
      cny_price: itemCostCny,
      quantity: items.reduce((sum: number, item: any) => sum + item.quantity, 0),
      notes: primaryItem.notes || '',
      items: items,
      shipping_mode: db_shipping_mode,
      screenshot_url: primaryItem.screenshot_url,
      total: totalGhs,
      order_status: 'pending_payment',
      payment_status: 'pending',
      payment_reference: payment_reference
    })
    .select()
    .single()

  if (insertError || !newOrder) {
    console.error('Insert Error:', insertError)
    return { error: insertError?.message || 'Failed to create order' }
  }

  // Create notification asynchronously without blocking
  import('@/utils/notifications').then(({ createNotification }) => {
    createNotification({
      userId: user.id,
      title: 'Order Placed successfully',
      message: `Your link order #${newOrder.id.toString().split('-').pop()?.substring(0,8)} has been placed and is pending payment.`,
      type: 'link_order_created',
      link: `/dashboard/orders/${newOrder.id}`
    });
  }).catch(e => console.warn('Failed to dispatch notification:', e));

  // We no longer initialize Hubtel here. The user will pay from their wallet.
  return { success: true, redirectUrl: `/dashboard/orders` };
}

export async function payLinkOrder(orderId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // 1. Fetch order
  const { data: order } = await supabase
    .from('orders')
    .select('id, total, payment_status, payment_reference')
    .eq('id', orderId)
    .eq('customer_id', user.id)
    .single()

  if (!order) return { success: false, error: 'Order not found' }
  if (order.payment_status === 'paid' || order.payment_status === 'Paid') {
    return { success: false, error: 'Order is already paid' }
  }
  if (!order.total || parseFloat(order.total) <= 0) {
    return { success: false, error: 'Invalid order total' }
  }

  // 2. Deduct from wallet
  const amount = parseFloat(order.total);
  const deductRes = await deductFromWallet(amount, 'link_order', `Payment for Link Order ${order.payment_reference}`, order.id);

  if (!deductRes.success) {
    return { success: false, error: deductRes.error || 'Failed to deduct from wallet' };
  }

  // 3. Update order status
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      order_status: 'processing'
    })
    .eq('id', order.id);

  if (updateError) {
    console.error('Error updating order after wallet payment:', updateError);
    return { success: false, error: 'Failed to update order status, but wallet was deducted. Please contact support.' };
  }

  const shortId = String(order.id).split('-').pop()?.substring(0, 8) || order.id;
  
  createNotification({
    userId: user.id,
    title: 'Link Order Paid',
    message: `Your payment of ₵${amount.toFixed(2)} for Link Order #${shortId} was successful. We will begin processing it shortly.`,
    type: 'link_order_paid',
    priority: 'important',
    link: `/dashboard/orders/${order.id}`
  }).catch(e => console.warn('Failed to dispatch notification:', e));

  return { success: true };
}

export async function updateLinkOrder(id: string, prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Unauthorized' }

  // Verify ownership and payment status
  const { data: order } = await supabase
    .from('orders')
    .select('payment_status, created_at, items, screenshot_url, notes')
    .eq('id', id)
    .eq('customer_id', user.id)
    .single()

  if (!order) return { error: 'Order not found' }
  if (order.payment_status === 'paid' || order.payment_status === 'Paid') {
    return { error: 'Cannot edit a paid order' }
  }

  const itemsJsonStr = formData.get('items_json') as string;
  const shipping_mode = formData.get('shipping') as string;

  if (!itemsJsonStr || !shipping_mode) {
    return { error: 'Missing required fields' };
  }

  let items = JSON.parse(itemsJsonStr);

  // Upload screenshots for each item if there's a new file
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const screenshot = formData.get(`screenshot_${item.id}`) as File | null;
    
    if (screenshot && screenshot.size > 0) {
      const fileBuffer = Buffer.from(await screenshot.arrayBuffer());
      const uploadResult = await uploadImage(fileBuffer, screenshot.name);

      if (!uploadResult.success || !uploadResult.url) {
        console.error('Upload Error:', uploadResult.error)
        return { error: `Failed to upload screenshot for item ${i + 1}: ${uploadResult.error || 'Unknown error'}` }
      }

      item.screenshot_url = uploadResult.url;
    }
    // If no new screenshot was uploaded, the client passed the existing item.screenshot_url back in the JSON
  }

  const settings = await getSettings()
  const exchangeRate = settings?.rate_link_orders || settings?.rate_shop_products || 0.5200
  const serviceFeePercentage = settings?.service_fee_percentage != null ? settings.service_fee_percentage / 100 : 0.15;
  const minServiceFee = settings?.minimum_service_fee || 5;
  const localDeliveryPercentage = settings?.local_delivery_percentage != null ? settings.local_delivery_percentage / 100 : 0;
  const minLocalDeliveryFee = settings?.minimum_local_delivery_fee || 0;

  // Calculate totals securely on the server
  const itemCostCny = items.reduce((sum: number, item: any) => sum + (item.cny_price * item.quantity), 0);
  const itemCostGhs = itemCostCny / exchangeRate;
  
  const calculatedServiceFee = itemCostGhs * serviceFeePercentage;
  const serviceFee = Math.max(calculatedServiceFee, minServiceFee);

  const calculatedLocalDelivery = itemCostGhs * localDeliveryPercentage;
  const localDelivery = Math.max(calculatedLocalDelivery, minLocalDeliveryFee);

  const totalGhs = itemCostGhs + serviceFee + localDelivery;

  const primaryItem = items[0];

  const db_shipping_mode = shipping_mode === 'normal' ? 'air_normal' : 
                           shipping_mode === 'express' ? 'air_express' : 
                           shipping_mode;

  const { error: updateError } = await supabase
    .from('orders')
    .update({
      product_link: primaryItem.product_link,
      product_name: primaryItem.product_link.substring(0, 80) + (items.length > 1 ? ` (+${items.length - 1} more items)` : ''),
      cny_price: itemCostCny,
      quantity: items.reduce((sum: number, item: any) => sum + item.quantity, 0),
      notes: order.notes, // keep existing notes containing hubtel checkout ids
      items: items,
      shipping_mode: db_shipping_mode,
      screenshot_url: primaryItem.screenshot_url || order.screenshot_url,
      total: totalGhs,
    })
    .eq('id', id)

  if (updateError) {
    return { error: updateError.message || 'Failed to update order' }
  }

  return { success: true, redirectUrl: `/dashboard/orders/${id}` }
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

  return { success: true, redirectUrl: '/dashboard/orders' }
}

export async function deleteLinkOrder(id: string) {
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
    return { error: 'Cannot delete a paid order' }
  }

  const { error: deleteError } = await supabase
    .from('orders')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return { error: deleteError.message || 'Failed to delete order' }
  }

  return { success: true, redirectUrl: '/dashboard/orders' }
}
