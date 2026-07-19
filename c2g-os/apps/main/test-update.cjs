const { createClient } = require('@supabase/supabase-js');
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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      order_status: 'processing'
    })
    .eq('id', 425)
    .select();
    
  console.log("UPDATE RES:", data, error);
}
run();
