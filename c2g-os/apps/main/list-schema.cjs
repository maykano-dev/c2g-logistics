const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function run() {
  const tablesToTry = ['orders', 'ecom_orders', 'packages', 'shipments', 'payments', 'customers', 'wallet_transactions', 'wallets', 'expenses'];
  for (const table of tablesToTry) {
     const res = await fetch(`${supabaseUrl}/rest/v1/${table}?limit=1`, {
       headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
     });
     if (!res.ok) {
       console.log(`Table ${table} error:`, res.statusText);
     } else {
       console.log(`Table ${table} exists.`);
       const data = await res.json();
       if (data && data.length > 0) {
         console.log(`  Columns:`, Object.keys(data[0]).join(', '));
       } else {
         console.log(`  (Table empty, columns unknown via REST)`);
       }
     }
  }
}
run();
