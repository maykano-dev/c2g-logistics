'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getDepositRates() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('platform_settings')
    .select('setting_key, setting_value')
    .in('setting_key', ['reservation_fee_ghs', 'air_normal_deposit_usd', 'air_express_deposit_usd', 'sea_deposit_usd']);

  if (error) {
    console.error('Error fetching deposit rates:', error);
    throw new Error('Failed to fetch deposit rates');
  }

  const rates: Record<string, number> = {};
  data.forEach((setting) => {
    rates[setting.setting_key] = setting.setting_value;
  });

  return rates;
}

export async function createReservation(
  shippingMode: string,
  selectedItems: { type: 'warehouse_package' | 'link_order' | 'mall_order', id: string }[],
  totalDeposit: number
) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Generate unique RES-ID
  const timestamp = Date.now().toString().slice(-6);
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  const reservationId = `RES-${timestamp}${randomStr}`;

  // 1. Create Reservation record
  const { error: resError } = await supabase
    .from('shipment_reservations')
    .insert({
      id: reservationId,
      customer_id: user.id,
      shipping_mode: shippingMode,
      deposit_amount: totalDeposit,
      deposit_paid: false,
      total_items: selectedItems.length,
      status: 'waiting_for_deposit'
    });

  if (resError) {
    console.error('Failed to create reservation:', resError);
    throw new Error('Failed to create reservation');
  }

  // 2. Link items to reservation
  const packageIds = selectedItems.filter(i => i.type === 'warehouse_package').map(i => i.id);
  const orderIds = selectedItems.filter(i => i.type === 'link_order').map(i => i.id);
  const ecomOrderIds = selectedItems.filter(i => i.type === 'mall_order').map(i => i.id);

  if (packageIds.length > 0) {
    await supabase.from('shipments').update({ reservation_id: reservationId }).in('id', packageIds);
  }
  if (orderIds.length > 0) {
    await supabase.from('orders').update({ reservation_id: reservationId }).in('id', orderIds);
  }
  if (ecomOrderIds.length > 0) {
    const uniqueMallIds = Array.from(new Set(ecomOrderIds));
    await supabase.from('ecom_orders').update({ reservation_id: reservationId }).in('id', uniqueMallIds);
  }

  revalidatePath('/dashboard/reservations');
  revalidatePath('/dashboard/packages');

  return { success: true, reservationId };
}

export async function payReservationDeposit(reservationId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Get Wallet
  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('id, available_balance')
    .eq('customer_id', user.id)
    .single();

  if (walletError || !wallet) {
    throw new Error('Wallet not found');
  }

  // Get Reservation Amount
  const { data: reservation, error: resError } = await supabase
    .from('shipment_reservations')
    .select('deposit_amount, deposit_paid')
    .eq('id', reservationId)
    .single();

  if (resError || !reservation) throw new Error('Reservation not found');
  if (reservation.deposit_paid) throw new Error('Deposit already paid');
  if (Number(wallet.available_balance) < Number(reservation.deposit_amount)) {
    throw new Error('Insufficient wallet balance');
  }

  // Use Atomic RPC to process the payment
  const { data: rpcResult, error: rpcError } = await supabase.rpc('process_reservation_deposit_atomic', {
    p_reservation_id: reservationId,
    p_wallet_id: wallet.id,
    p_deposit_amount: reservation.deposit_amount
  });

  if (rpcError || !rpcResult?.success) {
    console.error('RPC Failed, attempting JS fallback for reservation deposit:', rpcError || rpcResult?.error);
    
    // JS Fallback using service role key since RPC is missing
    const { createClient: createAdminClient } = await import('@supabase/supabase-js');
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const newBalance = Number(wallet.available_balance) - Number(reservation.deposit_amount);
    
    const { error: wErr } = await adminSupabase.from('wallets').update({ available_balance: newBalance }).eq('id', wallet.id);
    if (wErr) throw new Error('Failed to deduct from wallet');

    const { error: txErr } = await adminSupabase.from('wallet_transactions').insert({
      wallet_id: wallet.id,
      amount: -Number(reservation.deposit_amount),
      transaction_type: 'shipping_deposit_hold',
      status: 'completed',
      description: `Shipping Deposit for Reservation ${reservationId}`,
      metadata: { reservation_id: reservationId }
    });
    
    if (txErr) console.error('Failed to insert wallet transaction:', txErr);

    const { error: resUpdErr } = await adminSupabase.from('shipment_reservations').update({
      deposit_paid: true,
      status: 'reserved_for_shipment'
    }).eq('id', reservationId);
    
    if (resUpdErr) throw new Error('Failed to update reservation status');
  }

  revalidatePath('/dashboard/reservations');
  revalidatePath('/dashboard/wallet');
  revalidatePath('/dashboard/packages');

  return { success: true };
}

export async function getAvailableItemsForReservation() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Fetch warehouse packages (shipments)
  const { data: packages, error: pkgError } = await supabase
    .from('shipments')
    .select('id, tracking_number, items_description, status, image_url')
    .eq('customer_id', user.id)
    .eq('status', 'in_warehouse')
    .is('reservation_id', null)
    .order('created_at', { ascending: false });

  // Fetch link orders
  const { data: linkOrders, error: orderError } = await supabase
    .from('orders')
    .select('id, product_name, notes, status:order_status, screenshot_url')
    .eq('customer_id', user.id)
    .eq('order_status', 'in_warehouse')
    .is('reservation_id', null)
    .order('created_at', { ascending: false });

  // Fetch mall orders
  const { data: mallOrders, error: mallError } = await supabase
    .from('ecom_orders')
    .select('id, order_id, total_amount, status:order_status, items')
    .eq('customer_id', user.id)
    .eq('order_status', 'in_warehouse')
    .is('reservation_id', null)
    .order('created_at', { ascending: false });

  let flatMallOrders: any[] = [];
  if (mallOrders) {
    mallOrders.forEach((order) => {
      if (Array.isArray(order.items)) {
        order.items.forEach((item: any, idx: number) => {
          flatMallOrders.push({
            id: order.id, // Parent order ID
            item_id: `${order.id}-${idx}`, // Unique ID for UI
            order_id: order.order_id,
            product_name: item.name,
            total_amount: item.priceGhs || item.price,
            image_url: item.imageUrl || item.image_url,
            status: order.status
          });
        });
      }
    });
  }

  if (pkgError || orderError || mallError) {
    console.error('Error fetching available items', pkgError, orderError, mallError);
  }

  return {
    packages: packages || [],
    linkOrders: linkOrders || [],
    mallOrders: flatMallOrders || []
  };
}

export async function getMyReservations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('shipment_reservations')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }

  return data;
}
