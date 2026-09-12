const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'apps/main/.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function test() {
  const { data } = await supabase.from('ecom_orders').select('items').order('created_at', { ascending: false }).limit(2);
  console.log(JSON.stringify(data, null, 2));
}
test();
