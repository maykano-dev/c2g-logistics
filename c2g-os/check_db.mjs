import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: 'apps/main/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: user } = await supabase.from('customers').select('*').eq('email', 'Pobeng5566@gmail.com').single();
  if (!user) {
    console.log("User not found");
    return;
  }
  
  console.log("User ID:", user.id);
  
  const { data: packages, error } = await supabase
    .from('shipments')
    .select('id, tracking_number, status, registration_fee_paid, shipping_fee_paid')
    .eq('customer_id', user.id);
    
  if (error) console.error("Error:", error);
  console.log("Packages:", packages);
}
run();
