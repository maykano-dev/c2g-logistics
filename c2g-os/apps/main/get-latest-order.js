const fs = require('fs');

async function main() {
  const url = 'http://127.0.0.1:54321/rest/v1/ecom_orders?select=id,items,order_status&order=created_at.desc&limit=2';
  // Use the same anon key strategy from deep-debug.js
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const anonKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
  const anonKey = anonKeyMatch ? anonKeyMatch[1] : '';

  const res = await fetch(url, {
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`
    }
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

main();
