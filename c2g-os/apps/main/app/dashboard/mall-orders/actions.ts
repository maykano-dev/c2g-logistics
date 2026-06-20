"use server";

import { createClient } from "@/utils/supabase/server";

export async function getMallOrders() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("ecom_orders")
    .select("*")
    .eq("customer_id", authData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching mall orders:", error);
    return { success: false, error: error.message };
  }

  return { success: true, orders: data };
}

export async function getMallOrder(id: string) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("ecom_orders")
    .select("*")
    .eq("id", id)
    .eq("customer_id", authData.user.id)
    .single();

  if (error || !data) {
    console.error("Error fetching mall order:", error);
    return null;
  }

  return data;
}

export async function deleteMallOrder(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized' };

  // Verify it's unpaid
  const { data: order } = await supabase
    .from('ecom_orders')
    .select('payment_status')
    .eq('id', id)
    .eq('customer_id', user.id)
    .single();
    
  if (!order) return { error: 'Order not found' };
  if (order.payment_status === 'paid' || order.payment_status === 'Paid') {
    return { error: 'Cannot delete a paid order' };
  }

  const { error } = await supabase
    .from('ecom_orders')
    .delete()
    .eq('id', id)
    .eq('customer_id', user.id);

  if (error) {
    console.error('Error deleting order:', error);
    return { error: 'Failed to delete order' };
  }

  return { success: true };
}
