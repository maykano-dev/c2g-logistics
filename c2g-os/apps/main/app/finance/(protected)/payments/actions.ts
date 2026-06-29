'use server';

import { createClient } from '@/utils/supabase/server';

export async function getPayments() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  let allPayments: any[] = [];

  // 1. Ecom Orders (Mall Payments)
  const { data: ecomOrders, error: e1 } = await supabase
    .from('ecom_orders')
    .select('id, order_id, customer_name, customer_phone, total_amount, payment_gateway, payment_reference, updated_at')
    .eq('payment_status', 'paid')
    .order('updated_at', { ascending: false })
    .limit(100);
    
  if (e1) console.error("Ecom Orders error:", e1);
    
  if (ecomOrders) {
    allPayments = [...allPayments, ...ecomOrders.map(p => ({
      id: p.id,
      order_id: p.order_id,
      customer_name: p.customer_name,
      customer_phone: p.customer_phone,
      total_amount: p.total_amount,
      payment_gateway: p.payment_gateway || 'Hubtel',
      payment_reference: p.payment_reference,
      created_at: p.updated_at,
      type: 'Mall Order'
    }))];
  }

  // 2. Ecom Orders (Shipping Fees)
  const { data: ecomShipping, error: e2 } = await supabase
    .from('ecom_orders')
    .select('id, order_id, customer_name, customer_phone, shipping_cost, payment_gateway, shipping_fee_payment_reference, updated_at')
    .eq('shipping_fee_paid', true)
    .gt('shipping_cost', 0)
    .order('updated_at', { ascending: false })
    .limit(100);
    
  if (e2) console.error("Ecom Shipping error:", e2);

  if (ecomShipping) {
    allPayments = [...allPayments, ...ecomShipping.map(p => ({
      id: p.id + '_shipping',
      order_id: p.order_id + ' (Shipping)',
      customer_name: p.customer_name,
      customer_phone: p.customer_phone,
      total_amount: p.shipping_cost,
      payment_gateway: p.payment_gateway || 'Hubtel',
      payment_reference: p.shipping_fee_payment_reference,
      created_at: p.updated_at,
      type: 'Mall Shipping Fee'
    }))];
  }

  // 3. Link Orders
  const { data: linkOrders, error: e3 } = await supabase
    .from('orders')
    .select('id, customer_name, customer_phone, total, payment_reference, updated_at')
    .eq('payment_status', 'paid')
    .order('updated_at', { ascending: false })
    .limit(100);
    
  if (e3) console.error("Link Orders error:", e3);

  if (linkOrders) {
    allPayments = [...allPayments, ...linkOrders.map(p => ({
      id: p.id,
      order_id: 'LINK-' + (String(p.id).split('-')[0] || '').toUpperCase(),
      customer_name: p.customer_name,
      customer_phone: p.customer_phone,
      total_amount: p.total,
      payment_gateway: 'Hubtel',
      payment_reference: p.payment_reference,
      created_at: p.updated_at,
      type: 'Link Order'
    }))];
  }

  // 4. Wallet Top-ups
  const { data: walletTx, error: e4 } = await supabase
    .from('wallet_transactions')
    .select(`
      id, amount, reference_id, created_at,
      wallets (
        customers ( name, phone )
      )
    `)
    .eq('transaction_type', 'top_up')
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(100);
    
  if (e4) console.error("Wallet Tx error:", e4);

  if (walletTx) {
    allPayments = [...allPayments, ...walletTx.map(p => {
      const cust = Array.isArray(p.wallets) ? p.wallets[0]?.customers : (p.wallets as any)?.customers;
      const c = Array.isArray(cust) ? cust[0] : cust;
      return {
        id: p.id,
        order_id: 'WALLET-TOPUP',
        customer_name: c?.name || 'Customer',
        customer_phone: c?.phone || 'N/A',
        total_amount: p.amount,
        payment_gateway: 'Hubtel/Admin',
        payment_reference: p.reference_id,
        created_at: p.created_at,
        type: 'Wallet Top-Up'
      };
    })];
  }

  // 5. Package Registration Fees
  const { data: pkgReg, error: e5 } = await supabase
    .from('shipments')
    .select('id, tracking_number, customer_name, customer_contact, updated_at, registration_fee_payment_reference')
    .eq('registration_fee_paid', true)
    .order('updated_at', { ascending: false })
    .limit(100);
    
  if (e5) console.error("Pkg Reg error:", e5);

  if (pkgReg) {
    allPayments = [...allPayments, ...pkgReg.map(p => ({
      id: p.id + '_reg',
      order_id: 'PKG-REG',
      customer_name: p.customer_name || 'Customer',
      customer_phone: p.customer_contact || 'N/A',
      total_amount: 5,
      payment_gateway: 'Wallet',
      payment_reference: p.registration_fee_payment_reference || 'N/A',
      created_at: p.updated_at,
      type: 'Package Registration'
    }))];
  }

  // 6. Package Shipping Fees
  const { data: pkgShip, error: e6 } = await supabase
    .from('shipments')
    .select('id, tracking_number, customer_name, customer_contact, shipping_fee, updated_at, shipping_fee_payment_reference')
    .eq('shipping_fee_paid', true)
    .order('updated_at', { ascending: false })
    .limit(100);
    
  if (e6) console.error("Pkg Ship error:", e6);

  if (pkgShip) {
    allPayments = [...allPayments, ...pkgShip.map(p => ({
      id: p.id + '_ship',
      order_id: p.tracking_number || p.id.substring(0, 8),
      customer_name: p.customer_name || 'Customer',
      customer_phone: p.customer_contact || 'N/A',
      total_amount: p.shipping_fee || 0,
      payment_gateway: 'Wallet/Hubtel',
      payment_reference: p.shipping_fee_payment_reference || 'N/A',
      created_at: p.updated_at,
      type: 'Package Shipping Fee'
    }))];
  }

  // Sort all payments by date descending
  allPayments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Calculate summary
  const totalReceived = allPayments.reduce((sum, o: any) => sum + Number(o.total_amount || 0), 0);

  return { success: true, payments: allPayments, summary: { totalReceived, count: allPayments.length } };
}
