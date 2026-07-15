import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const results: any[] = [];

  // 1. Fetch Link Orders
  const { data: linkOrders, error: linkError } = await supabase
    .from('orders')
    .select('id, payment_reference, payment_status')
    .in('payment_status', ['pending', 'awaiting_payment'])
    .not('payment_reference', 'is', null);

  if (linkOrders) {
    for (const order of linkOrders) {
      if (order.payment_reference) {
        try {
          const res = await fetch(`http://localhost:3001/api/hubtel/verify?clientReference=${order.payment_reference}`);
          const data = await res.json();
          results.push({ type: 'link_order', id: order.id, ref: order.payment_reference, data });
        } catch (err: any) {
          results.push({ type: 'link_order', id: order.id, error: err.message });
        }
      }
    }
  }

  // 2. Fetch Ecom Orders
  const { data: ecomOrders, error: ecomError } = await supabase
    .from('ecom_orders')
    .select('id, payment_reference, payment_status')
    .in('payment_status', ['pending', 'awaiting_payment'])
    .not('payment_reference', 'is', null);

  if (ecomOrders) {
    for (const order of ecomOrders) {
      if (order.payment_reference) {
        try {
          const res = await fetch(`http://localhost:3001/api/hubtel/verify?clientReference=${order.payment_reference}`);
          const data = await res.json();
          results.push({ type: 'ecom_order', id: order.id, ref: order.payment_reference, data });
        } catch (err: any) {
          results.push({ type: 'ecom_order', id: order.id, error: err.message });
        }
      }
    }
  }

  return NextResponse.json({ success: true, verified: results.length, results });
}
