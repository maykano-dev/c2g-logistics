const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const query = 'awal';
  const q = `%${query}%`;
  const cleanQuery = query.trim();
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanQuery);

  const { data: matchedCustomers, error: customerError } = await supabase
    .from('customers')
    .select('id')
    .or(`name.ilike.${q},email.ilike.${q},phone.ilike.${q},customer_unique_id.ilike.${q}`);
    
  if (customerError) {
      console.error("CUSTOMER ERROR:", customerError);
  }

  const customerIds = (matchedCustomers || []).map(c => c.id);
  console.log("Matched customer IDs:", customerIds);

  let req = supabase.from('wallets').select('*');

  if (isUUID) {
    if (customerIds.length > 0) {
      req = req.or(`id.eq.${cleanQuery},customer_id.eq.${cleanQuery},customer_id.in.(${customerIds.join(',')})`);
    } else {
      req = req.or(`id.eq.${cleanQuery},customer_id.eq.${cleanQuery}`);
    }
  } else {
    if (customerIds.length > 0) {
      req = req.in('customer_id', customerIds);
    } else {
      console.log("No customers matched");
      return;
    }
  }

  const { data, error } = await req;
  if (error) {
    console.error("WALLET ERROR:", error);
  } else {
    console.log("SUCCESS:", data.length);
  }
}
run();
