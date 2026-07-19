import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data, error } = await supabase.from('transactions').select('*').limit(1);
  console.log(error ? 'transactions: ' + error.message : 'transactions: exists');
  const { data: d2, error: e2 } = await supabase.from('hubtel_payments').select('*').limit(1);
  console.log(e2 ? 'hubtel_payments: ' + e2.message : 'hubtel_payments: exists');
  const { data: d3, error: e3 } = await supabase.from('payment_transactions').select('*').limit(1);
  console.log(e3 ? 'payment_transactions: ' + e3.message : 'payment_transactions: exists');
}
run();
