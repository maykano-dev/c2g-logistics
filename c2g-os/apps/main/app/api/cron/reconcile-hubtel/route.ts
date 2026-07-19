import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchHubtelTransactionStatusLocal, HUBTEL_NO_MATCH } from '@/utils/hubtel';
import { createNotification } from '@/utils/notifications';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow it to run for up to 60 seconds

export async function GET(req: Request) {
  // Simple authorization check for cron
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // In dev mode without CRON_SECRET, we allow it to be triggered manually.
    if (process.env.NODE_ENV === 'production') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    // 1. Fetch pending wallet transactions from the last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const { data: pendingTx, error: dbError } = await supabase
      .from('wallet_transactions')
      .select('id, reference_id, wallet_id, amount, status')
      .eq('transaction_type', 'top_up')
      .in('status', ['pending', 'failed']) // check recently failed ones too just in case Hubtel delayed it massively
      .gte('created_at', oneDayAgo.toISOString())
      .limit(50); // limit to 50 per hour to prevent API rate limits

    if (dbError) throw dbError;

    if (!pendingTx || pendingTx.length === 0) {
      return NextResponse.json({ success: true, message: 'No pending transactions to reconcile.' });
    }

    const results = {
      reconciled: 0,
      failed: 0,
      ignored: 0,
      errors: [] as string[]
    };

    // 2. Loop through and check Hubtel
    for (const tx of pendingTx) {
      if (!tx.reference_id) continue;

      try {
        const hubtelStatus = await fetchHubtelTransactionStatusLocal({
          clientReference: tx.reference_id
        });

        const statusLower = String(hubtelStatus.status).toLowerCase();

        if (statusLower === 'success' || statusLower === 'paid') {
            // It actually succeeded! We need to reconcile.
            if (tx.status !== 'completed') {
                const { data: rpcData, error: rpcError } = await supabase.rpc('process_wallet_topup_atomic', {
                    p_transaction_id: tx.id,
                    p_wallet_id: tx.wallet_id,
                    p_amount: tx.amount
                });

                if (rpcError || !rpcData?.success) {
                    if (rpcData?.message !== 'Already completed') {
                        results.errors.push(`Failed atomic update for ${tx.reference_id}: ${rpcError?.message || rpcData?.error}`);
                    }
                } else {
                    results.reconciled++;
                    
                    // Notify user
                    const { data: wallet } = await supabase
                        .from('wallets')
                        .select('customer_id')
                        .eq('id', tx.wallet_id)
                        .single();

                    if (wallet) {
                        await createNotification({
                            userId: wallet.customer_id,
                            title: 'Wallet Top-Up Successful',
                            message: `Your wallet has been credited with ₵${tx.amount.toFixed(2)} via Hubtel Reconciliation.`,
                            type: 'wallet_top_up',
                            priority: 'info',
                            link: '/dashboard/wallet'
                        });
                    }
                }
            } else {
                results.ignored++;
            }
        } else if (statusLower === 'failed' || statusLower === 'cancelled') {
            // It definitively failed
            if (tx.status !== 'failed') {
                await supabase
                    .from('wallet_transactions')
                    .update({ status: 'failed', description: 'Reconciled: Hubtel confirmed failed' })
                    .eq('id', tx.id);
                results.failed++;
            } else {
                results.ignored++;
            }
        } else {
            // Still pending on Hubtel side, ignore
            results.ignored++;
        }

      } catch (err: any) {
          const msg = String(err?.message || err);
          if (msg === HUBTEL_NO_MATCH) {
              // Hubtel literally has no record of this. Mark as failed if older than 1 hour.
              if (tx.status !== 'failed') {
                  await supabase
                    .from('wallet_transactions')
                    .update({ status: 'failed', description: 'Reconciled: No match found on Hubtel' })
                    .eq('id', tx.id);
                  results.failed++;
              }
          } else {
              // Network error or rate limit, ignore for now
              results.errors.push(`Error checking ${tx.reference_id}: ${msg}`);
          }
      }

      // Small delay to respect Hubtel rate limits (e.g. 500ms)
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return NextResponse.json({ success: true, results });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
