"use server";

import { createClient } from "@/utils/supabase/server";
import { UpdateProfileSchema } from "@/utils/security-schemas";

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

  const nameRaw = formData.get("name") as string;
  const phoneRaw = formData.get("phone") as string;
  const telegram_chat_idRaw = formData.get("telegram_chat_id") as string;
  const telegram_notifications_enabledRaw = formData.get("telegram_notifications_enabled") === "true";

  const validation = UpdateProfileSchema.safeParse({
    name: nameRaw,
    phone: phoneRaw,
    telegram_chat_id: telegram_chat_idRaw,
    telegram_notifications_enabled: telegram_notifications_enabledRaw,
  });

  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message || 'Validation failed' };
  }

  const { name, phone, telegram_chat_id, telegram_notifications_enabled } = validation.data;

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

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    return { success: false, error: "Not authenticated" };
  }

  // Call the custom RPC function to delete the user account
  const { error } = await supabase.rpc('delete_user_account');

  if (error) {
    console.error("Error deleting account:", error);
    return { success: false, error: error.message };
  }

  await supabase.auth.signOut();
  return { success: true };
}

export async function getActiveSessions() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from('user_sessions')
    .select('id, ip_address, user_agent, last_active_at, created_at')
    .eq('user_id', authData.user.id)
    .order('last_active_at', { ascending: false });

  if (error) {
    console.error("Error fetching sessions:", error);
    return { success: false, error: error.message };
  }

  return { success: true, sessions: data };
}

export async function terminateAllSessions() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    return { success: false, error: "Not authenticated" };
  }

  // Delete all sessions in the custom table
  const { error } = await supabase
    .from('user_sessions')
    .delete()
    .eq('user_id', authData.user.id);

  if (error) {
    console.error("Error terminating sessions:", error);
    return { success: false, error: error.message };
  }

  // Force sign out of all devices via Supabase
  await supabase.auth.signOut({ scope: 'others' });
  
  // Return success
  return { success: true };
}
