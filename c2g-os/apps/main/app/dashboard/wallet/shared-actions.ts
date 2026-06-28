"use server";

import { createClient } from "@/utils/supabase/server";

export async function getSecureWalletBalance() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, available_balance: 0, held_balance: 0 };
  }

  const { data: wallet } = await supabase
    .from("wallets")
    .select("available_balance, held_balance")
    .eq("customer_id", user.id)
    .single();

  if (!wallet) {
    return { success: false, available_balance: 0, held_balance: 0 };
  }

  return { 
    success: true, 
    available_balance: Number(wallet.available_balance) || 0,
    held_balance: Number(wallet.held_balance) || 0
  };
}
