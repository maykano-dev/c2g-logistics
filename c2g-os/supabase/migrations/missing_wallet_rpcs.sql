-- 1. Initialize Wallet Top-Up
CREATE OR REPLACE FUNCTION initialize_wallet_top_up(
  p_wallet_id UUID,
  p_amount NUMERIC,
  p_reference_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_exists BOOLEAN;
BEGIN
  -- Verify wallet belongs to calling user
  SELECT EXISTS (
    SELECT 1 FROM public.wallets 
    WHERE id = p_wallet_id AND customer_id = auth.uid()
  ) INTO v_wallet_exists;

  IF NOT v_wallet_exists THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized or wallet not found');
  END IF;

  -- Create pending transaction
  INSERT INTO public.wallet_transactions (
    wallet_id,
    amount,
    transaction_type,
    status,
    reference_id,
    description
  ) VALUES (
    p_wallet_id,
    p_amount,
    'top_up',
    'pending',
    p_reference_id,
    'Wallet Top Up via Hubtel'
  );

  RETURN jsonb_build_object('success', true);
END;
$$;


-- 2. Process Wallet Top-Up (Atomic)
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


-- 3. Cleanup Stale Pending Wallet Transactions
CREATE OR REPLACE FUNCTION cleanup_stale_wallet_transactions()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  -- We only allow authenticated users to trigger this for safety, though it can be public if needed.
  -- To restrict to service_role or admins, you could add: IF NOT is_admin() THEN RETURN ... END IF;
  
  -- Delete pending wallet top-up transactions older than 3 hours
  WITH deleted AS (
    DELETE FROM public.wallet_transactions
    WHERE status = 'pending' 
      AND transaction_type = 'top_up'
      AND created_at < NOW() - INTERVAL '3 hours'
      AND wallet_id IN (
        -- Only delete their own transactions for safety, unless you want a global cleanup
        SELECT id FROM public.wallets WHERE customer_id = auth.uid()
      )
    RETURNING id
  )
  SELECT count(*) INTO v_deleted_count FROM deleted;

  RETURN jsonb_build_object('success', true, 'deleted_count', v_deleted_count);
END;
$$;


-- 4. Enforce UNIQUE Reference ID
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'wallet_transactions_reference_id_key') THEN
        ALTER TABLE public.wallet_transactions ADD CONSTRAINT wallet_transactions_reference_id_key UNIQUE (reference_id);
    END IF;
END $$;
