"use server";

import { createClient } from "@/utils/supabase/server";

export async function getImporterOrders() {
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

  const { data: orders, error } = await supabase
    .from('ecom_orders')
    .select('*')
    .eq('importer_id', importer.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching importer orders:', error);
    return { success: false, error: error.message };
  }

  // Map the DB rows to a format expected by the UI
  const mappedOrders = (orders || []).map((o: any) => ({
    id: o.order_id || `ORD-${o.id}`,
    raw_id: o.id,
    customer_name: o.customer_name || 'Unknown Customer',
    date: o.created_at,
    amount_ghs: o.total_amount || 0,
    profit_ghs: o.total_profit_ghs || 0,
    status: o.order_status || 'pending',
    items: o.items || [],
  }));

  return { success: true, orders: mappedOrders };
}
