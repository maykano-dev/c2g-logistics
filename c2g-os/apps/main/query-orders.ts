import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = envFile.split('\n').reduce((acc: any, line) => {
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
  console.log("Querying orders for Saeed Umuhaira...");
  
  // Find customer
  const { data: customer, error: custErr } = await supabase
    .from('customers')
    .select('id, name')
    .ilike('name', '%Saeed%')
    .limit(1)
    .single();

  if (custErr || !customer) {
    console.log("Customer not found:", custErr);
    
    // Fallback: just query the orders directly by name
    const { data: directOrders } = await supabase
      .from('orders')
      .select('id, customer_name, total, payment_status, order_status, created_at')
      .ilike('customer_name', '%Saeed%')
      .order('created_at', { ascending: false })
      .limit(10);
      
    console.log("Found direct orders by name:", directOrders);
    return;
  }

  console.log(`Found Customer: ${customer.name} (${customer.id})`);

  // Query link orders
  const { data: linkOrders } = await supabase
    .from('orders')
    .select('id, total, payment_status, order_status, created_at')
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false })
    .limit(5);

  console.log("Recent Link Orders:", linkOrders);

  // Query wallet
  const { data: wallet } = await supabase
    .from('wallets')
    .select('id, balance')
    .eq('customer_id', customer.id)
    .single();

  if (wallet) {
    console.log(`Wallet Balance: ${wallet.balance}`);
    
    // Query wallet transactions
    const { data: txs } = await supabase
      .from('wallet_transactions')
      .select('id, transaction_type, amount, status, created_at')
      .eq('wallet_id', wallet.id)
      .order('created_at', { ascending: false })
      .limit(5);

    console.log("Recent Wallet Txs:", txs);
  }
}

run();
