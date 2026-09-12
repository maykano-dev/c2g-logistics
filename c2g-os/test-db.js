const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/main/.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function test() {
  const { data } = await supabase.from('warehouse_addresses').select('*').eq('is_default', true).single();
  console.log(data);
}
test();
