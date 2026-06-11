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
