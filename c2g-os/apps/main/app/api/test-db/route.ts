import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const results = [];
  const modes = ['invalid_mode', 'air', 'sea', 'express'];
  
  for (const mode of modes) {
    const { error } = await supabase.from('orders').insert({
      customer_id: '11111111-1111-1111-1111-111111111111',
      customer_name: 'test',
      type: 'link_order',
      product_link: 'a',
      product_name: 'a',
      cny_price: 1,
      quantity: 1,
      shipping_mode: mode,
      total: 1
    });
    results.push({ mode, error: error?.message || 'Success' });
  }

  return NextResponse.json(results);
}
