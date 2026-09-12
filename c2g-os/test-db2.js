const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/main/.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function test() {
  const { data: cols } = await supabase.rpc('get_table_columns', { table_name: 'ecom_orders' });
  console.log("ecom_orders columns", cols);
}
test();
