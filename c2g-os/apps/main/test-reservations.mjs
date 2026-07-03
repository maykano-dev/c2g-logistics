import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function test() {
  const { data, error } = await supabase.from('shipment_reservations').select('*, customers(first_name, last_name, email, phone)');
  console.log('Error:', JSON.stringify(error, null, 2));
  console.log('Data count:', data?.length);
}
test();
