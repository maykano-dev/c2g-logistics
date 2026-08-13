import fs from 'fs';
import { resolve } from 'path';

const env = fs.readFileSync('apps/main/.env.local', 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) acc[match[1]] = match[2].replace(/^["']|["']$/g, '');
    return acc;
  }, {});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const headers = { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' };

async function fetchS(path, query = '') {
  const url = `${SUPABASE_URL}/rest/v1/${path}?${query}`;
  const res = await fetch(url, { headers });
  const data = await res.json();
  if (data.error || data.message) console.error("Error fetching", path, data);
  return Array.isArray(data) ? data : [];
}

async function main() {
  console.log("Checking Order 444...");
  
  const order = await fetchS('orders', 'id=eq.444');
  console.log("Order 444:");
  console.log(JSON.stringify(order, null, 2));
  
  if (order.length > 0) {
    console.log("Checking wallet transactions for LNK-444...");
    const txs = await fetchS('wallet_transactions', `reference_id=eq.LNK-444`);
    console.log(JSON.stringify(txs, null, 2));
  }
}

main().catch(console.error);
