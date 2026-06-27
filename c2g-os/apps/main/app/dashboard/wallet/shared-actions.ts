"use server";

import { createClient } from "@/utils/supabase/server";

export async function getSecureWalletBalance() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, available_balance: 0, hold_balance: 0 };
  }

  const { data: wallet } = await supabase
    .from("wallets")
    .select("available_balance, hold_balance")
    .eq("customer_id", user.id)
    .single();

  if (!wallet) {
    return { success: false, available_balance: 0, hold_balance: 0 };
  }

  return { 
    success: true, 
    available_balance: Number(wallet.available_balance) || 0,
    hold_balance: Number(wallet.hold_balance) || 0
  };
}
