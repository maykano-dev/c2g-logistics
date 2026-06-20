import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '/home/maykano/Downloads/New C2g Logistics/c2g-os/apps/main/.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data: settings } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single();

  console.log("Settings:", settings);
  
  // Find a pending link order
  const { data: orders } = await supabase.from('orders').select('*').eq('payment_status', 'pending').limit(1);
  console.log("Pending order:", orders);
}

test();
