-- =====================================================================
-- Wallet Payment Cron Sweep
-- =====================================================================
-- Problem: Outdated RPC `pay_link_order_atomic` deducts wallet balances 
-- but fails to update the order status. This leaves orders in a "Pending" 
-- state despite payment success.
--
-- Solution: A `pg_cron` scheduled job that sweeps `orders` and `ecom_orders`
-- every minute, identifying those with a `completed` wallet transaction but 
-- still stuck in a "pending" payment status, and automatically fixing them.
-- =====================================================================

-- Step 1: Create the sweeping function
CREATE OR REPLACE FUNCTION public.sweep_stuck_wallet_orders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Fix stuck Link Orders
  UPDATE public.orders o
  SET payment_status = 'paid',
      order_status = 'processing',
      updated_at = timezone('utc'::text, now())
  FROM public.wallet_transactions wt
  WHERE wt.reference_id = 'LNK-' || o.id
    AND o.payment_status = 'pending'
    AND wt.status = 'completed';

  -- Fix stuck Mall Orders
  UPDATE public.ecom_orders eo
  SET payment_status = 'paid',
      order_status = 'processing',
      updated_at = timezone('utc'::text, now())
  FROM public.wallet_transactions wt
  WHERE wt.reference_id = 'MALL-' || eo.id
    AND eo.payment_status = 'pending'
    AND wt.status = 'completed';

END;
$$;

-- Step 2: Schedule the sweep to run every minute
-- Note: 'sweep-stuck-wallet-orders' is the unique job name
SELECT cron.schedule(
  'sweep-stuck-wallet-orders',
  '* * * * *',
  $$SELECT public.sweep_stuck_wallet_orders()$$
);
