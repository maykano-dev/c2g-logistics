const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function run() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from('withdrawals')
    .select('id, customers(id)')
    .limit(1);
    
  if (error) {
    console.log("Error object keys:", Object.keys(error));
    console.log("Error details:", JSON.stringify(error, null, 2));
    console.log("Error raw:", error);
  } else {
    console.log("Success:", data);
  }
}
run();
