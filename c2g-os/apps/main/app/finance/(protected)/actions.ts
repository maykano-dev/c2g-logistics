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

    // 1. Today's Revenue (Sum of all payments made within 24 hours)
    // We query ecom_orders where payment_status is 'paid' and it was updated in the last 24 hours
    const { data: paidOrders } = await supabase
      .from('ecom_orders')
      .select('total_amount, total_cost_ghs, total_profit_ghs')
      .eq('payment_status', 'paid')
      .gte('updated_at', startOfMonthISO);

    const monthlyRevenue = paidOrders?.reduce((sum, o) => sum + Number(o.total_amount || 0), 0) || 0;
    const ordersCostOfGoods = paidOrders?.reduce((sum, o) => sum + Number(o.total_cost_ghs || 0), 0) || 0;
    const ordersProfit = paidOrders?.reduce((sum, o) => sum + Number(o.total_profit_ghs || 0), 0) || 0;

    // 2. Today's Expenses (Operational expenses paid in the last 24 hours)
    const { data: expensesTx } = await supabase
      .from('expenses')
      .select('amount')
      .eq('status', 'paid')
      .gte('paid_at', startOfMonthISO);

    const operationalExpenses = expensesTx?.reduce((sum, ex) => sum + Number(ex.amount || 0), 0) || 0;
    
    const monthlyExpenses = ordersCostOfGoods + operationalExpenses;
    const monthlyProfit = ordersProfit - operationalExpenses;

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

    // 5. Generate Chart Data (Last 7 Days)
    const revenueByDay = [];
    const profitByMonth = [];

    // Helper to get past dates
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString('en-US', { weekday: 'short' });
      revenueByDay.push({ name: dateString, revenue: i === 0 ? monthlyRevenue : 0 });
    }

    // Profit by Month (Last 7 Months)
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthString = d.toLocaleDateString('en-US', { month: 'short' });
      profitByMonth.push({ name: monthString, profit: i === 0 ? monthlyProfit : 0 });
    }

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
