import { createClient } from '@supabase/supabase-js';
// since this is .js and type module, I can't use require. I need to read .env manually or just grab the keys from .env.local
import fs from 'fs';
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if(k && v) env[k] = v.replace(/"/g, '');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.rpc('get_employees_status_check');
  console.log("Error:", error);
}
check();
