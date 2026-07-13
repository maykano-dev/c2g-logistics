import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => {
  const match = env.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].replace(/['"]/g, '').trim() : null;
};

const url = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const key = getEnv('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.from('customers').select('*').eq('id', '0fedc09d-64fe-4e72-a9d8-78c0e32fceb4');
  console.log("Found rows:", data?.length);
  if (error) console.error("Error:", error);
}
run();
