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

async function main() {
  console.log("Attempting to PATCH order 443...");
  const url = `${SUPABASE_URL}/rest/v1/orders?id=eq.443`;
  const res = await fetch(url, { 
    method: 'PATCH',
    headers,
    body: JSON.stringify({ payment_status: 'paid' })
  });
  
  const data = await res.json();
  console.log("PATCH Response:", data);
}

main().catch(console.error);
