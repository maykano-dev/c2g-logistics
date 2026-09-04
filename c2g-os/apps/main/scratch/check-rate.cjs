const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim().replace(/"/g, '');
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim().replace(/"/g, '');

async function check() {
  const r1 = await fetch(`${url}/rest/v1/settings?select=rate_shop_products`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  const data1 = await r1.json();
  
  const r2 = await fetch(`${url}/rest/v1/system_settings?select=key,value&key=eq.exchange_rate_cny_ghs`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  const data2 = await r2.json();
  
  console.log('settings table (rate_shop_products):', data1);
  console.log('system_settings (exchange_rate_cny_ghs):', data2);
}
check();
