import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data: order } = await supabase.from('ecom_orders').select('items').not('items', 'is', null).limit(5);
  console.log(JSON.stringify(order, null, 2));
}
run();
