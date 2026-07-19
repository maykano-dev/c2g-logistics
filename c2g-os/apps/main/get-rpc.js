import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data, error } = await supabase.rpc('get_function_source', { function_name: 'process_wallet_topup_atomic' });
  if (error) {
     // fallback if get_function_source doesn't exist
     console.log('Use terminal psql to dump');
  } else {
     console.log(data);
  }
}
run();
