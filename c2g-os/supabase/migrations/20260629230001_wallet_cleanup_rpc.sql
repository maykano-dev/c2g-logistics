-- RPC for safely cleaning up stale top-up transactions without requiring service role keys
CREATE OR REPLACE FUNCTION public.cleanup_stale_topups()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.wallet_transactions
  SET status = 'failed'
  WHERE status = 'pending'
    AND transaction_type = 'top_up'
    AND created_at < (now() - interval '30 minutes')
    AND wallet_id IN (
      SELECT id FROM public.wallets WHERE customer_id = auth.uid()
    );
END;
$$;
