"use server";

import { createClient } from "@/utils/supabase/server";

export async function getWalletStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  // Get importer ID
  const { data: importer } = await supabase
    .from('importers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!importer) return { success: false, error: 'Importer not found' };

  // Fetch all orders for this importer to calculate earnings
  const { data: orders, error: ordersError } = await supabase
    .from('ecom_orders')
    .select('id, order_id, created_at, total_profit_ghs, order_status, payment_status')
    .eq('importer_id', importer.id);

  if (ordersError) {
    console.error('Error fetching orders for wallet:', ordersError);
    return { success: false, error: ordersError.message };
  }

  let totalEarned = 0;
  let pendingClearance = 0;
  let walletBalance = 0;
  const transactions: any[] = [];

  // Calculate earnings from orders
  orders?.forEach((o: any) => {
    const profit = parseFloat(o.total_profit_ghs || 0);
    if (profit <= 0) return;

    if (o.payment_status === 'paid' && o.order_status === 'delivered') {
      totalEarned += profit;
      walletBalance += profit;
      transactions.push({
        id: `TXN-${o.id}`,
        date: o.created_at,
        type: 'earning',
        description: `Earnings from Order ${o.order_id || o.id}`,
        amount: profit,
        status: 'completed'
      });
    } else if (o.payment_status === 'paid' && o.order_status !== 'delivered') {
      pendingClearance += profit;
      transactions.push({
        id: `TXN-${o.id}`,
        date: o.created_at,
        type: 'pending_clearance',
        description: `Pending clearance for Order ${o.order_id || o.id}`,
        amount: profit,
        status: 'pending'
      });
    }
  });

  // Try to fetch withdrawals if the table exists
  try {
    const { data: withdrawals, error: withdrawalError } = await supabase
      .from('wallet_withdrawals')
      .select('*')
      .eq('importer_id', importer.id);

    if (!withdrawalError && withdrawals) {
      withdrawals.forEach((w: any) => {
        const amount = parseFloat(w.amount || 0);
        if (amount > 0) {
          if (w.status === 'completed' || w.status === 'approved') {
            walletBalance -= amount;
          }
          transactions.push({
            id: `WDL-${w.id}`,
            date: w.created_at,
            type: 'withdrawal',
            description: `Withdrawal to ${w.method || 'Mobile Money'}`,
            amount: -amount,
            status: w.status || 'pending'
          });
        }
      });
    }
  } catch (e) {
    // Ignore if table doesn't exist
  }

  // Sort transactions by date descending
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    success: true,
    stats: {
      wallet_balance: walletBalance,
      pending_clearance: pendingClearance,
      total_earned: totalEarned,
    },
    transactions
  };
}
