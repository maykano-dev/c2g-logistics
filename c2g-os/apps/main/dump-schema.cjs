const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Checking wallet_transactions schema...");
  const { data: tx, error: txErr } = await supabase.from('wallet_transactions').select('reference_id').limit(1);
  console.log("wallet_transactions.reference_id type test:", typeof tx?.[0]?.reference_id, txErr?.message || 'OK');
  
  // Try to insert a UUID without hyphens into reference_id directly
  const testRef = 'e8974bdc0338179a8afbcb7d1f6ebef7';
  
  // Just query by it to see if it complains about type integer
  const { error: queryErr } = await supabase.from('wallet_transactions').select('id').eq('reference_id', testRef).limit(1);
  console.log("Query by text reference_id error:", queryErr?.message || 'OK');
}

main().catch(console.error);
