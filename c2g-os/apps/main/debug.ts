import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function run() {
  const { error: e3 } = await supabase.from('orders').select('id, customer_name, customer_phone, total, payment_reference, updated_at').limit(1);
  console.log("e3:", e3?.message);
  const { error: e6 } = await supabase.from('shipments').select('id, tracking_number, customer_name, customer_contact, shipping_fee, updated_at, shipping_fee_payment_reference').limit(1);
  console.log("e6:", e6?.message);
}
run();
