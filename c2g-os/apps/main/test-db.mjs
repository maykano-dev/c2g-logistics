import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: order } = await supabase.from('ecom_orders').select('items').not('items', 'is', null).limit(1);
  console.log("Order items:", JSON.stringify(order[0].items, null, 2));

  const { data: product } = await supabase.from('products').select('*').limit(1);
  console.log("Product:", JSON.stringify(product[0], null, 2));
}

run();
