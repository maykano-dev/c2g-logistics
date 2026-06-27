require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function get() {
  const { data, error } = await supabase.from('customers').select('*').limit(1);
  console.log("Error:", error);
  if (data && data.length) console.log("Keys:", Object.keys(data[0]));
}
get();
