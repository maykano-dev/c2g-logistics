import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = envFile.split('\n').reduce((acc: any, line) => {
  const [key, ...rest] = line.split('=');
  if (key) {
    let val = rest.join('=');
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    }
    acc[key.trim()] = val.trim();
  }
  return acc;
}, {});

const adminClient = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function testUpdate() {
  const { data, error } = await adminClient
    .from('orders')
    .update({ payment_status: 'paid' })
    .eq('id', 425)
    .select('id, payment_status');
    
  console.log("Error:", error);
  console.log("Data:", data);
}

testUpdate();
