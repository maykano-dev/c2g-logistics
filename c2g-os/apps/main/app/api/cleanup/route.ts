import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: reservations, error: resError } = await supabase
    .from('shipment_reservations')
    .select('id')
    .like('id', 'RES-LEGACY-%')
    .eq('status', 'in_transit');

  if (resError || !reservations) {
    return NextResponse.json({ error: resError });
  }

  let deletedCount = 0;

  for (const res of reservations) {
    const { data: shipments } = await supabase.from('shipments').select('id').eq('reservation_id', res.id).eq('status', 'in_warehouse');
    const { data: ecomOrders } = await supabase.from('ecom_orders').select('id').eq('reservation_id', res.id).eq('order_status', 'in_warehouse');
    const { data: orders } = await supabase.from('orders').select('id').eq('reservation_id', res.id).eq('order_status', 'in_warehouse');

    const hasPackageInWarehouse = 
      (shipments && shipments.length > 0) || 
      (ecomOrders && ecomOrders.length > 0) || 
      (orders && orders.length > 0);

    if (hasPackageInWarehouse) {
      const { error: delError } = await supabase.from('shipment_reservations').delete().eq('id', res.id);
      if (!delError) deletedCount++;
    }
  }

  return NextResponse.json({ success: true, checked: reservations.length, deleted: deletedCount });
}
