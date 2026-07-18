const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.rpc('process_scanned_package_bulk', { candidates: ['YT8883756088558'] });
  console.log('Data:', data);
  console.log('Error:', error);
}

run();
