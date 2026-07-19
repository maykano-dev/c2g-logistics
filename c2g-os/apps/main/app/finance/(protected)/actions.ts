'use server';

import { createClient } from '@/utils/supabase/server';

export async function getDetailedAnalytics() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    // We fetch base KPIs from our DB RPC (Wallet Liabilities, Pending Withdrawals, Pending Refunds, Cash Available (placeholder inside RPC))
    const { data: baseKpis, error: kpiError } = await supabase.rpc('get_financial_health_kpis');
    
    // Now we compute the dynamic metrics
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);
    const startOfMonthISO = startOfMonth.toISOString();

    // 1. Accurate Revenue & Revenue by Day (Using actual wallet_transactions representing paid services)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0,0,0,0);

    const { data: revenueTxs } = await supabase
      .from('wallet_transactions')
      .select('amount, created_at')
      .in('transaction_type', ['link_order', 'mall_order', 'package_fee', 'invoice'])
      .eq('status', 'completed')
      .gte('created_at', startOfMonthISO); // We fetch for the whole month, filter last 7 days in memory

    let monthlyRevenue = 0;
    const revenueByDayMap: Record<string, number> = {};

    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      revenueByDayMap[d.toLocaleDateString('en-US', { weekday: 'short' })] = 0;
    }

    if (revenueTxs) {
      revenueTxs.forEach(tx => {
        const amt = Math.abs(Number(tx.amount || 0));
        monthlyRevenue += amt; // Add to monthly total

        const txDate = new Date(tx.created_at);
        if (txDate >= sevenDaysAgo) {
          const dayStr = txDate.toLocaleDateString('en-US', { weekday: 'short' });
          if (revenueByDayMap[dayStr] !== undefined) {
            revenueByDayMap[dayStr] += amt;
          }
        }
      });
    }

    const revenueByDay = Object.keys(revenueByDayMap).map(key => ({
      name: key,
      revenue: revenueByDayMap[key]
    }));

    // 2. Accurate Profit by Month (Last 7 Months)
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 6);
    sevenMonthsAgo.setDate(1);
    sevenMonthsAgo.setHours(0,0,0,0);

    const { data: historicalOrders } = await supabase
      .from('ecom_orders')
      .select('total_cost_ghs, total_profit_ghs, updated_at')
      .eq('payment_status', 'paid')
      .gte('updated_at', sevenMonthsAgo.toISOString());

    const profitByMonthMap: Record<string, number> = {};
    let monthlyExpenses = 0;

    // Initialize last 7 months
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      profitByMonthMap[d.toLocaleDateString('en-US', { month: 'short' })] = 0;
    }

    const currentMonthStr = new Date().toLocaleDateString('en-US', { month: 'short' });

    if (historicalOrders) {
      historicalOrders.forEach(o => {
         const d = new Date(o.updated_at);
         const m = d.toLocaleDateString('en-US', { month: 'short' });
         if (profitByMonthMap[m] !== undefined) {
           profitByMonthMap[m] += Number(o.total_profit_ghs || 0);
         }
         // Add to current month expenses if applicable
         if (m === currentMonthStr) {
           monthlyExpenses += Number(o.total_cost_ghs || 0);
         }
      });
    }

    // Subtract Operational Expenses
    const { data: historicalExpenses } = await supabase
      .from('expenses')
      .select('amount, paid_at')
      .eq('status', 'paid')
      .gte('paid_at', sevenMonthsAgo.toISOString());

    if (historicalExpenses) {
      historicalExpenses.forEach(ex => {
         const d = new Date(ex.paid_at);
         const m = d.toLocaleDateString('en-US', { month: 'short' });
         const amt = Number(ex.amount || 0);
         if (profitByMonthMap[m] !== undefined) {
           profitByMonthMap[m] -= amt;
         }
         if (m === currentMonthStr) {
           monthlyExpenses += amt;
         }
      });
    }

    const profitByMonth = Object.keys(profitByMonthMap).map(key => ({
      name: key,
      profit: profitByMonthMap[key]
    }));

    const monthlyProfit = profitByMonthMap[currentMonthStr] || 0;

    // 3. Debts & Shipping (Outstanding shipping fees)
    const { data: unpaidShipping } = await supabase
      .from('ecom_orders')
      .select('customer_id, shipping_cost')
      .eq('shipping_fee_paid', false)
      .gt('shipping_cost', 0);

    const outstandingShippingFees = unpaidShipping?.reduce((sum, o) => sum + Number(o.shipping_cost || 0), 0) || 0;
    const overdueShippingCustomers = new Set(unpaidShipping?.map(o => o.customer_id)).size;

    // 4. Pending Procurement
    const { data: pendingOrders } = await supabase
      .from('ecom_orders')
      .select('total_cost_ghs')
      .eq('procurement_status', 'pending');
      
    const pendingProcurement = pendingOrders?.reduce((sum, o) => sum + Number(o.total_cost_ghs || 0), 0) || 0;

    // 6. Cash Available
    // The user requested Cash Available to be the total balance of all customers combined.
    // This perfectly matches the 'wallet_liabilities' calculation from the RPC (which sums available + held balances).
    const cashAvailable = baseKpis?.wallet_liabilities || 0;

    return { 
      success: true, 
      kpis: {
        ...(baseKpis || {}),
        cash_available: cashAvailable > 0 ? cashAvailable : 0, // Override RPC cash
      },
      metrics: {
        monthlyRevenue,
        revenueGrowth: "0%", // Dynamic growth requires previous day
        monthlyExpenses,
        monthlyProfit,
        outstandingCustomerBalances: outstandingShippingFees, // Debt is our outstanding balance
        pendingProcurement,
        outstandingShippingFees,
        overdueShippingCustomers,
        revenueByDay,
        profitByMonth
      }
    };
  } catch (error: any) {
    console.error("Analytics Error:", error);
    return { success: false, error: error.message };
  }
}
// force recompile
