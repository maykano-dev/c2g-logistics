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
  // We can't query information_schema directly via REST API. 
  // Let's just fetch one order and look at its exact returned shape.
  const linkOrders = await fetchS('orders', 'select=*&limit=1');
  console.log(linkOrders);
}

main().catch(console.error);
