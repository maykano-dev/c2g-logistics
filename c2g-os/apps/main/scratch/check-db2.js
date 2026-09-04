import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf-8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1];
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1];

const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from('products').select('id, title, thumbnail_url, catalog_type').limit(10);
  console.log('Products:', JSON.stringify(data, null, 2), error);
}
check();
