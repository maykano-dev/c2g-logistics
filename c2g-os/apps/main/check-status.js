import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: shipments, error } = await supabase.from('shipments').select('id, customer_id, tracking_number, status, reservation_id').limit(10).order('created_at', { ascending: false });
  console.log("SHIPMENTS:", shipments);

  const { data: orders } = await supabase.from('orders').select('id, customer_id, product_name, order_status, reservation_id').limit(10).order('created_at', { ascending: false });
  console.log("ORDERS:", orders);
}
run();
