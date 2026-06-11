"use server";

import { createClient } from "@/utils/supabase/server";

export async function getCustomerProfile() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("customers")
    .select("name, email, phone, customer_unique_id, telegram_chat_id, telegram_notifications_enabled")
    .eq("id", authData.user.id)
    .single();

  if (error) {
    console.error("Error fetching customer profile:", error);
    return { success: false, error: error.message };
  }

  return { success: true, profile: data };
}

export async function updateCustomerProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    return { success: false, error: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const telegram_chat_id = formData.get("telegram_chat_id") as string;
  const telegram_notifications_enabled = formData.get("telegram_notifications_enabled") === "true";

  const { error } = await supabase
    .from("customers")
    .update({
      name,
      phone,
      telegram_chat_id,
      telegram_notifications_enabled,
    })
    .eq("id", authData.user.id);

  if (error) {
    console.error("Error updating customer profile:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
