-- 6. Atomic Wallet Top-Up
CREATE OR REPLACE FUNCTION process_wallet_topup_atomic(
  p_transaction_id UUID,
  p_wallet_id UUID,
  p_amount NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_status TEXT;
  v_current_balance NUMERIC;
  v_new_balance NUMERIC;
BEGIN
  -- Lock the transaction row to prevent concurrent processing of the same top-up
  SELECT status INTO v_current_status
  FROM public.wallet_transactions
  WHERE id = p_transaction_id
  FOR UPDATE;

  IF v_current_status IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Transaction not found');
  END IF;

  -- Idempotency check: if already completed, do nothing and return success
  IF v_current_status = 'completed' THEN
    RETURN jsonb_build_object('success', true, 'message', 'Already completed');
  END IF;

  IF v_current_status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Transaction is not in pending state');
  END IF;

  -- Lock the wallet row to prevent concurrent balance updates
  SELECT available_balance INTO v_current_balance
  FROM public.wallets
  WHERE id = p_wallet_id
  FOR UPDATE;

  IF v_current_balance IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Wallet not found');
  END IF;

  -- Perform the top-up
  v_new_balance := v_current_balance + p_amount;

  UPDATE public.wallets
  SET available_balance = v_new_balance
  WHERE id = p_wallet_id;

  -- Mark transaction as completed
  UPDATE public.wallet_transactions
  SET status = 'completed',
      updated_at = NOW()
  WHERE id = p_transaction_id;

  RETURN jsonb_build_object('success', true, 'new_balance', v_new_balance);
END;
$$;
