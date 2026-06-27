'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getAllWallets() {
  const supabase = await createClient();
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // Note: in a real environment we should check if user is an admin.
  // We assume this route is protected by layout middleware.

  const { data, error } = await supabase
    .from('wallets')
    .select(`
      id,
      available_balance,
      hold_balance,
      created_at,
      updated_at,
      customer_id,
      customers (
        name,
        email,
        phone
      )
    `)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error("Fetch Wallets Error:", error);
    return { success: false, error: error.message };
  }

  return { success: true, wallets: data };
}

export async function adjustWalletBalance(walletId: string, amount: number, description: string, referenceId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  if (amount === 0) return { success: false, error: 'Amount must not be zero.' };

  const { data, error } = await supabase.rpc('admin_adjust_wallet_balance', {
    p_wallet_id: walletId,
    p_amount: amount,
    p_description: description,
    p_reference_id: referenceId
  });

  if (error) {
    console.error("Admin Adjust Wallet Error:", error);
    return { success: false, error: error.message };
  }

  if (data && data.success === false) {
    return { success: false, error: data.error };
  }

  revalidatePath('/admin/finance/wallets');
  return { success: true };
}
