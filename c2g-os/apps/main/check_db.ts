import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Checking DB for wallet payment inconsistencies...");
  
  // 1. Check link orders
  const { data: linkOrders, error: linkErr } = await supabase
    .from('orders')
    .select('id, payment_status, order_status, customer_id, payment_reference, total')
    .eq('payment_status', 'pending');
    
  if (linkErr) console.error(linkErr);
  
  let issueLinkOrders = [];
  if (linkOrders) {
    for (const order of linkOrders) {
      // Check wallet_transactions for this order. 
      // The RPC inserts reference_id as 'LNK-' || p_order_id, wait, let's see what it inserts
      // Actually it inserts 'LNK-' || p_order_id in reference_id! 
      // Oh wait, in pay_link_order_atomic: 
      // VALUES (..., 'LNK-' || p_order_id, 'completed')
      
      const { data: txs } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('reference_id', 'LNK-' + order.id)
        .eq('status', 'completed');
        
      if (txs && txs.length > 0) {
        issueLinkOrders.push({ order, tx: txs[0] });
      }
    }
  }

  console.log(`Found ${issueLinkOrders.length} Link Orders with completed wallet transactions but 'pending' payment status.`);
  if (issueLinkOrders.length > 0) {
     console.log("Sample Link Issue:", issueLinkOrders[0]);
  }

  // 2. Check Mall orders
  const { data: mallOrders, error: mallErr } = await supabase
    .from('ecom_orders')
    .select('id, payment_status, order_status, customer_id, payment_reference')
    .eq('payment_status', 'pending');
    
  let issueMallOrders = [];
  if (mallOrders) {
    for (const order of mallOrders) {
      const { data: txs } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('reference_id', 'MALL-' + order.id)
        .eq('status', 'completed');
        
      if (txs && txs.length > 0) {
        issueMallOrders.push({ order, tx: txs[0] });
      }
    }
  }
  
  console.log(`Found ${issueMallOrders.length} Mall Orders with completed wallet transactions but 'pending' payment status.`);

  // 3. Check Packages bulk payments
  // The packages RPC is pay_packages_atomic
  // Packages are updated from 'pending_payment' to 'awaiting_arrival'
  const { data: packages } = await supabase
    .from('shipments')
    .select('id, status, registration_fee_paid')
    .eq('registration_fee_paid', false);
    
  // Check if any wallet_transactions exist for packages. The reference_id is PKG-BULK-user.id-timestamp usually
  // I will just check wallet_transactions for PKG-BULK that are completed
  const { data: pkgTxs } = await supabase
    .from('wallet_transactions')
    .select('*')
    .like('reference_id', 'PKG-BULK-%')
    .eq('status', 'completed');
    
  console.log(`Found ${pkgTxs?.length || 0} completed Package Bulk transactions.`);
  // Wait, if packages are still not marked as paid, it's hard to trace because they are bulk updated.
}

main();
