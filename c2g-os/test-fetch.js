require('dotenv').config({ path: 'apps/main/.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
supabase.from('warehouse_addresses').select('*').then(({data, error}) => {
  console.log("Data:", data);
  console.log("Error:", error);
});
