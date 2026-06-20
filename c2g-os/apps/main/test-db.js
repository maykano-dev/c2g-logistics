import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '/home/maykano/Downloads/New C2g Logistics/c2g-os/apps/main/.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data: p } = await supabase.from('products').select('*').limit(1);
  console.log("Product:", p);
}

test();
