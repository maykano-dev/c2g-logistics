require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.rpc('get_financial_health_kpis');
  console.log('RPC KPIs:', data, error);
  
  const { data: w } = await supabase.from('wallets').select('available_balance, held_balance');
  const sum = w.reduce((acc, curr) => acc + Number(curr.available_balance) + Number(curr.held_balance), 0);
  console.log('Wallet Sum:', sum);
}
run();
