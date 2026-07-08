"use server";

import { createClient } from "@/utils/supabase/server";
import { procureOrder } from "@/lib/alibaba/procurement";
import { revalidatePath } from "next/cache";

export async function getPendingProcurementJobs() {
  const supabase = await createClient();
  
  // Ensure the user is an admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("procurement_jobs")
    .select(`
      id,
      status,
      created_at,
      error_log,
      ecom_orders (
        id,
        order_id,
        customer_name,
        customer_phone,
        total_amount,
        total_cost_ghs,
        snapshot_price_usd,
        snapshot_exchange_rate,
        items
      )
    `)
    .eq("status", "pending_approval")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching jobs:", error);
    return { success: false, error: error.message };
  }

  return { success: true, jobs: data };
}

export async function triggerManualProcurement(jobId: string) {
  const supabase = await createClient();
  
  // Ensure the user is an admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };
  
  // Prevent double-clicking
  const { data: jobStatus } = await supabase
    .from("procurement_jobs")
    .select("status")
    .eq("id", jobId)
    .single();
    
  if (jobStatus?.status !== 'pending_approval' && jobStatus?.status !== 'failed') {
    return { success: false, error: "Job is already being processed or completed." };
  }
  
  // Set to processing immediately to lock it
  await supabase
    .from("procurement_jobs")
    .update({ status: 'processing' })
    .eq("id", jobId);

  const res = await procureOrder(jobId);
  
  revalidatePath("/admin/alibaba-orders");
  return res;
}

export async function cancelProcurementJob(jobId: string) {
  const supabase = await createClient();
  
  // Ensure the user is an admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { error } = await supabase
    .from("procurement_jobs")
    .update({ status: 'cancelled', error_log: 'Cancelled manually by Admin' })
    .eq("id", jobId);

  if (error) {
    return { success: false, error: error.message };
  }
  
  // Also refund the order? (Assuming wallet or manual refund later)
  
  revalidatePath("/admin/alibaba-orders");
  return { success: true };
}
