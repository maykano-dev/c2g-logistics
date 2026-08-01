const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('customers').select('*').eq('email', 'akosuabanahene65@gmail.com');
  console.log('Customer:', data, error);
  
  // get 1 shipment to see schema
  const { data: s } = await supabase.from('shipments').select('*').limit(1);
  console.log('Shipment schema:', s ? Object.keys(s[0]) : null);
}
run();
