'use server';

import { createClient } from '@/utils/supabase/server';

export async function getFinancialHealthKPIs() {
  const supabase = await createClient();
  
  // Verify user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // Note: the RPC is extremely fast for calculating high level metrics.
  // We use the `get_financial_health_kpis` RPC deployed in our migration.
  const { data, error } = await supabase.rpc('get_financial_health_kpis');

  if (error) {
    console.error("KPI Error:", error);
    return { success: false, error: error.message };
  }

  return { success: true, kpis: data };
}
