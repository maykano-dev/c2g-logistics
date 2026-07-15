const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('shipments').select('*').limit(5);
  console.log('Error:', error);
  console.log('Data count with service role:', data?.length);

  const supabaseAnon = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const res = await supabaseAnon.from('shipments').select('*').limit(5);
  console.log('Data count with anon role:', res.data?.length);
}

test();
