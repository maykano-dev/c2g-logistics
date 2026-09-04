const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('wallet_transactions').select('reference_id').limit(1);
  console.log('wallet_transactions:', data, error);
  
  const { data: job, error: jobErr } = await supabase.from('procurement_jobs').select('ecom_order_id').limit(1);
  console.log('procurement_jobs:', job, jobErr);
}
test();
