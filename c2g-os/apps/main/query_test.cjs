const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('shipments').select('id, tracking_number, customer_id').limit(5);
  console.log("Shipments:", data);
  console.log("Error:", error);
}
run();
