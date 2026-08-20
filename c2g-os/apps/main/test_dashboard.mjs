import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  console.log('Testing Supabase queries...');
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  
  try {
    const promises = [
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('order_status', 'new').then(() => console.log('1 done')),
      supabase.from('shipments').select('*', { count: 'exact', head: true }).eq('status', 'in_warehouse').then(() => console.log('2 done')),
      supabase.from('shipments').select('*', { count: 'exact', head: true }).in('status', ['in_transit', 'clearing_customs', 'ready_for_pickup']).then(() => console.log('3 done')),
      supabase.from('customers').select('*', { count: 'exact', head: true }).then(() => console.log('4 done')),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('payment_status', 'awaiting_payment').then(() => console.log('5 done')),
      supabase.from('ecom_orders').select('*', { count: 'exact', head: true }).then(() => console.log('6 done')),
      supabase.from('products').select('*', { count: 'exact', head: true }).then(() => console.log('7 done')),
      supabase.from('customers').select('*', { count: 'exact', head: true }).in('role', ['importer', 'admin']).then(() => console.log('8 done')),
      supabase.from('incoming_packages').select('*', { count: 'exact', head: true }).eq('status', 'received').then(() => console.log('9 done')),
      supabase.from('incoming_packages').select('*', { count: 'exact', head: true }).eq('status', 'shipped').then(() => console.log('10 done')),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('payment_status', 'paid').eq('order_status', 'pending').then(() => console.log('11 done')),
      
      supabase.from('orders').select('total').gte('created_at', firstDayOfMonth).eq('payment_status', 'paid').then(() => console.log('12 done')),
      supabase.from('ecom_orders').select('total_amount, shipping_cost').gte('created_at', firstDayOfMonth).eq('payment_status', 'paid').then(() => console.log('13 done')),
      supabase.from('shipments').select('shipping_cost').gte('created_at', firstDayOfMonth).eq('shipping_fee_paid', true).then(() => console.log('14 done')),
      
      supabase.from('orders').select('id, customer_name, total, order_status, payment_status, created_at').order('created_at', { ascending: false }).limit(5).then(() => console.log('15 done')),
      
      supabase.from('products').select('id, name, sku, stock, product_variants(id, sku, stock, variant_options)').then(() => console.log('16 done')),
    ];

    await Promise.all(promises);
    console.log('All queries completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
