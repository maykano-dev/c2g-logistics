-- Fix: Allow users to create pending wallet top-up transactions without needing
-- the service role key. Uses SECURITY DEFINER so the function runs as the DB
-- owner and bypasses RLS, but strictly validates that the wallet belongs to
-- the calling authenticated user before inserting.

CREATE OR REPLACE FUNCTION public.initialize_wallet_top_up(
  p_wallet_id UUID,
  p_amount NUMERIC,
  p_reference_id TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transaction_id UUID;
BEGIN
  -- Security check: wallet must belong to the calling authenticated user
  IF NOT EXISTS (
    SELECT 1 FROM public.wallets
    WHERE id = p_wallet_id AND customer_id = auth.uid()
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Insert the pending transaction
  INSERT INTO public.wallet_transactions (
    wallet_id,
    amount,
    transaction_type,
    description,
    reference_id,
    status
  ) VALUES (
    p_wallet_id,
    p_amount,
    'top_up',
    'Wallet Top Up',
    p_reference_id,
    'pending'
  ) RETURNING id INTO v_transaction_id;

  RETURN jsonb_build_object('success', true, 'transaction_id', v_transaction_id);

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
