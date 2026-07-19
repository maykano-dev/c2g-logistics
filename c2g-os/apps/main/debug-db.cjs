const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, ...rest] = line.split('=');
  if (key) acc[key] = rest.join('=').replace(/^"|"$/g, '').trim();
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { error: e3 } = await supabase.from('orders').select('id, customer_name, customer_phone, total, payment_reference, updated_at').limit(1);
  console.log("e3 error:", e3?.message);
  const { error: e6 } = await supabase.from('shipments').select('id, tracking_number, customer_name, customer_contact, shipping_fee, updated_at, shipping_fee_payment_reference').limit(1);
  console.log("e6 error:", e6?.message);
}

run();
