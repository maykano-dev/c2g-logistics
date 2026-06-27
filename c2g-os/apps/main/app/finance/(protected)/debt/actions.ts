'use server';

import { createClient } from '@/utils/supabase/server';

export async function getCustomerDebts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // Fetch customers with outstanding shipping fees or negative wallet balance (though wallets shouldn't be negative)
  // For now, let's fetch from packages where registration_fee_paid is false
  // And shipments where shipping_fee_paid is false
  
  // This is a simplified aggregated view. In a massive DB, this should be a DB view or cron aggregated table.
  const { data: customers, error } = await supabase
    .from('customers')
    .select(`
      id,
      name,
      email,
      phone,
      shipments!left (
        id,
        tracking_number,
        shipping_fee_paid,
        registration_fee_paid
      )
    `);

  if (error) {
    console.error("Debt fetch error", error);
    return { success: false, error: 'Failed to fetch debts' };
  }

  const debtors = customers
    ?.map(customer => {
      const unpaidShipments = customer.shipments?.filter((s: any) => s.shipping_fee_paid === false) || [];
      const unpaidRegistrations = customer.shipments?.filter((s: any) => s.registration_fee_paid === false) || [];
      
      const totalDebt = (unpaidShipments.length * 150) + (unpaidRegistrations.length * 5); // Mock calculations

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        unpaidShipments: unpaidShipments.length,
        unpaidRegistrations: unpaidRegistrations.length,
        totalDebt,
        riskLevel: totalDebt > 1000 ? 'High' : totalDebt > 200 ? 'Medium' : 'Low'
      };
    })
    .filter(c => c.totalDebt > 0)
    .sort((a, b) => b.totalDebt - a.totalDebt) || [];

  return { success: true, debtors };
}
