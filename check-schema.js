const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'c2g-os/apps/main/.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: customer } = await supabase.from('customers').select('*').limit(1);
  console.log('Customer:', customer[0]);
  
  if (customer[0]) {
    const { data: wallet } = await supabase.from('wallets').select('*').eq('user_id', customer[0].user_id).limit(1);
    console.log('Wallet by user_id:', wallet[0]);
    
    const { data: wallet2 } = await supabase.from('wallets').select('*').eq('user_id', customer[0].id).limit(1);
    console.log('Wallet by customer id:', wallet2[0]);
    
    const { data: order } = await supabase.from('ecom_orders').select('*').limit(1);
    console.log('Ecom Order:', order[0]);
    
    const { data: shipment } = await supabase.from('shipments').select('*').limit(1);
    console.log('Shipment:', shipment[0]);
  }
}
check();
