import { createClient } from '@supabase/supabase-js';
require('dotenv').config({ path: 'apps/main/.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function test() {
  const { data } = await supabase.from('ecom_products').select('id, supplier_id, external_id, title').eq('id', '104785');
  console.log(data);
}
test();
