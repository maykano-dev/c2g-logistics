import fs from 'fs';

const env = fs.readFileSync('apps/main/.env.local', 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) acc[match[1]] = match[2].replace(/^["']|["']$/g, '');
    return acc;
  }, {});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const headers = { 
  'apikey': SUPABASE_KEY, 
  'Authorization': `Bearer ${SUPABASE_KEY}`, 
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

async function fetchS(path, query = '') {
  const url = `${SUPABASE_URL}/rest/v1/${path}?${query}`;
  const res = await fetch(url, { headers });
  const data = await res.json();
  if (data.error || data.message) console.error("Error fetching", path, data);
  return Array.isArray(data) ? data : [];
}

async function updateOrder(id, payload) {
  const url = `${SUPABASE_URL}/rest/v1/orders?id=eq.${id}`;
  const res = await fetch(url, { 
    method: 'PATCH',
    headers,
    body: JSON.stringify(payload)
  });
  return await res.json();
}

async function main() {
  console.log("Finding stuck Link Orders...");
  const pendingOrders = await fetchS('orders', 'payment_status=eq.pending&select=id');
  
  let fixedCount = 0;
  for (const o of pendingOrders) {
    const txs = await fetchS('wallet_transactions', `reference_id=eq.LNK-${o.id}&status=eq.completed`);
    if (txs && txs.length > 0) {
      console.log(`Fixing Order ${o.id}...`);
      await updateOrder(o.id, {
        payment_status: 'paid',
        order_status: 'processing'
      });
      fixedCount++;
    }
  }
  
  console.log(`Fixed ${fixedCount} stuck orders.`);
}

main().catch(console.error);
