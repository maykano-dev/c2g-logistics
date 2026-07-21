const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
  const [key, ...rest] = line.split('=');
  if (key) {
    let val = rest.join('=');
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    }
    acc[key.trim()] = val.trim();
  }
  return acc;
}, {});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log("Updating Link Orders...");
  const { data: linkOrders, error: linkErr } = await supabase
    .from('orders')
    .update({ order_status: 'processing' })
    .eq('payment_status', 'paid')
    .in('order_status', ['pending_payment', 'new', 'pending'])
    .select('id');
    
  if (linkErr) console.error("Link Order Error:", linkErr);
  else console.log(`Updated ${linkOrders.length} Link Orders`);

  console.log("Updating Mall Orders...");
  const { data: mallOrders, error: mallErr } = await supabase
    .from('ecom_orders')
    .update({ order_status: 'processing' })
    .eq('payment_status', 'paid')
    .in('order_status', ['pending_payment', 'new', 'pending'])
    .select('id');

  if (mallErr) console.error("Mall Order Error:", mallErr);
  else console.log(`Updated ${mallOrders.length} Mall Orders`);
}

run();
