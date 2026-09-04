import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  console.log("Fetching wallet_transactions schema...");
  const { data: tx, error: txErr } = await supabase.from('wallet_transactions').select('reference_id').limit(1);
  console.log('wallet_transactions.reference_id error:', txErr);
  
  console.log("Fetching ecom_orders schema...");
  const { data: eo, error: eoErr } = await supabase.from('ecom_orders').select('id, items').limit(1);
  console.log('ecom_orders.items error:', eoErr);
  
  console.log("Fetching procurement_jobs schema...");
  const { data: pj, error: pjErr } = await supabase.from('procurement_jobs').select('ecom_order_id').limit(1);
  console.log('procurement_jobs.ecom_order_id error:', pjErr);
}
test();
