'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

// Reusable helper to get the authenticated customer's wallet
export async function getMyWallet() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  // Get customer id
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!customer) return { success: false, error: 'Customer not found' };

  // Get wallet
  const { data: wallet, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('customer_id', customer.id)
    .single();

  if (error || !wallet) {
    return { success: false, error: 'Wallet not found' };
  }

  return { success: true, wallet };
}

export async function getMyWalletHistory() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!customer) return { success: false, error: 'Customer not found' };

  const { data: wallet } = await supabase
    .from('wallets')
    .select('id')
    .eq('customer_id', customer.id)
    .single();

  if (!wallet) return { success: false, error: 'Wallet not found' };

  const { data: transactions, error } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('wallet_id', wallet.id)
    .order('created_at', { ascending: false });

  if (error) return { success: false, error: error.message };

  return { success: true, transactions };
}

export async function deductFromWallet(amount: number, type: string, description: string, referenceId?: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!customer) return { success: false, error: 'Customer not found' };

  const { data, error } = await supabase.rpc('process_wallet_deduction', {
    p_customer_id: customer.id,
    p_amount: Math.abs(amount),
    p_transaction_type: type,
    p_description: description,
    p_reference_id: referenceId || null
  });

  if (error) {
    console.error("RPC Wallet Deduction Error:", error);
    return { success: false, error: error.message };
  }

  if (data && data.success === false) {
    return { success: false, error: data.error };
  }

  try {
    const { createNotification } = await import('@/utils/notifications');
    await createNotification({
      userId: customer.id,
      title: 'Wallet Deduction Successful',
      message: `₵${Math.abs(amount).toFixed(2)} was deducted from your wallet for: ${description}`,
      type: 'wallet_deduction',
      priority: 'info',
      link: '/dashboard/wallet'
    });
  } catch (err) {
    console.error("Failed to dispatch wallet deduction notification:", err);
  }

  revalidatePath('/dashboard/wallet');
  return { success: true };
}

export async function holdShippingDeposit(amount: number, packageId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { data, error } = await supabase.rpc('hold_shipping_deposit_atomic', {
    p_customer_id: user.id,
    p_amount: Math.abs(amount),
    p_package_id: packageId
  });

  if (error) {
    console.error("RPC Hold Shipping Deposit Error:", error);
    return { success: false, error: error.message };
  }

  if (data && data.success === false) {
    return { success: false, error: data.error };
  }

  revalidatePath('/dashboard/wallet');
  return { success: true };
}

import { initializeHubtelPayment } from '@/utils/hubtel';

export async function topUpWallet(amount: number, phone?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  let { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('id, name, email')
    .eq('id', user.id)
    .single();

  if (customerError || !customer) {
    // Auto-create customer profile for standard email signups
    const { data: newCustomer, error: newCustomerError } = await supabase
      .from('customers')
      .insert({
          id: user.id,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email,
          phone: user.user_metadata?.phone || ''
      })
      .select('id, name, email')
      .single();
      
    if (newCustomerError || !newCustomer) {
      console.error("TopUp Auto-Create Customer Error:", newCustomerError);
      return { success: false, error: 'Customer profile not found and could not be created' };
    }
    customer = newCustomer;
  }

  const ref = `WLT-${Math.random().toString(36).substring(2, 12)}`.toUpperCase();
  
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  try {
    const hubtelData = await initializeHubtelPayment({
        amount: amount,
        reference: ref,
        customerName: customer.name || 'C2G Customer',
        customerPhone: phone || undefined,
        customerEmail: customer.email,
        description: `Wallet Top Up for C2G Logistics`,
        returnUrl: `${appUrl}/payment-status?reference=${ref}`,
        cancelUrl: `${appUrl}/dashboard/wallet?status=cancelled&ref=${ref}`,
        callbackUrl: `${appUrl}/api/hubtel/callback`,
        hubtelApiId: process.env.HUBTEL_API_ID || process.env.HUBTEL_CLIENT_ID,
        hubtelApiKey: process.env.HUBTEL_API_KEY || process.env.HUBTEL_CLIENT_SECRET,
        hubtelMerchantAccount: process.env.HUBTEL_MERCHANT_ACCOUNT
    });

    let { data: wallet } = await supabase
      .from('wallets')
      .select('id')
      .eq('customer_id', customer.id)
      .maybeSingle();

    if (!wallet) {
      // Auto-create wallet for users missing one
      const { data: newWallet, error: walletCreateError } = await supabase
        .from('wallets')
        .insert({ customer_id: customer.id })
        .select('id')
        .single();

      if (walletCreateError || !newWallet) {
        console.error("Wallet Creation Error:", walletCreateError);
        return { success: false, error: 'Failed to initialize wallet profile' };
      }
      wallet = newWallet;
    }

    // Use SECURITY DEFINER RPC to bypass RLS safely.
    // The function validates that the wallet belongs to the calling user.
    const { data: rpcResult, error: rpcError } = await supabase.rpc('initialize_wallet_top_up', {
      p_wallet_id: wallet.id,
      p_amount: amount,
      p_reference_id: ref
    });

    if (rpcError || (rpcResult && rpcResult.success === false)) {
      console.error("Wallet Tx Init Error:", rpcError || rpcResult?.error);
      // Strictly block checkout if local transaction could not be recorded
      return { success: false, error: 'Failed to record transaction locally. Please try again.' };
    }

    return { success: true, checkoutUrl: hubtelData.checkoutUrl };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to initialize payment' };
  }
}

export async function resolveShippingHold(packageId: string, heldAmount: number, actualAmount: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { data, error } = await supabase.rpc('resolve_shipping_hold_atomic', {
    p_customer_id: user.id,
    p_held_amount: heldAmount,
    p_actual_cost: actualAmount,
    p_package_id: packageId
  });

  if (error) {
    console.error("RPC Resolve Shipping Hold Error:", error);
    return { success: false, error: error.message };
  }

  if (data && data.success === false) {
    return { success: false, error: data.error };
  }

  revalidatePath('/dashboard/wallet');
  return { success: true };
}
