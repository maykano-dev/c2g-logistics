const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
  const [key, ...rest] = line.split('=');
  if (key) {
    let val = rest.join('=');
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    }
    acc[key.trim()] = val.trim();
  }
  return acc;
}, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' };

async function run() {
  const url = `${supabaseUrl}/rest/v1/wallet_transactions?select=amount,created_at,transaction_type&status=eq.completed`;
  const txsRes = await fetch(url, { headers });
  const txs = await txsRes.json();
  console.log("Types:", new Set(txs.map(t => t.transaction_type)));
}
run();
