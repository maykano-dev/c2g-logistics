-- Wallet Atomic RPCs for robust concurrency handling

-- 1. Process Wallet Deduction
CREATE OR REPLACE FUNCTION process_wallet_deduction(
  p_customer_id UUID,
  p_amount NUMERIC,
  p_transaction_type TEXT,
  p_description TEXT,
  p_reference_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_id UUID;
  v_current_balance NUMERIC;
  v_new_balance NUMERIC;
  v_transaction_id UUID;
BEGIN
  -- Lock the row for update to prevent race conditions
  SELECT id, available_balance INTO v_wallet_id, v_current_balance
  FROM public.wallets
  WHERE customer_id = p_customer_id
  FOR UPDATE;

  IF v_wallet_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Wallet not found');
  END IF;

  IF v_current_balance < p_amount THEN
    -- Log failed attempt
    INSERT INTO public.wallet_transactions (wallet_id, amount, transaction_type, description, reference_id, status)
    VALUES (v_wallet_id, -p_amount, p_transaction_type, 'Failed: ' || p_description || ' (Insufficient funds)', p_reference_id, 'failed');
    
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient wallet balance.');
  END IF;

  -- Deduct balance
  v_new_balance := v_current_balance - p_amount;
  
  UPDATE public.wallets
  SET available_balance = v_new_balance
  WHERE id = v_wallet_id;

  -- Log successful transaction
  INSERT INTO public.wallet_transactions (wallet_id, amount, transaction_type, description, reference_id, status)
  VALUES (v_wallet_id, -p_amount, p_transaction_type, p_description, p_reference_id, 'completed')
  RETURNING id INTO v_transaction_id;

  RETURN jsonb_build_object('success', true, 'transaction_id', v_transaction_id, 'new_balance', v_new_balance);
END;
$$;

-- 2. Hold Shipping Deposit
CREATE OR REPLACE FUNCTION hold_shipping_deposit_atomic(
  p_customer_id UUID,
  p_amount NUMERIC,
  p_package_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_id UUID;
  v_current_balance NUMERIC;
  v_current_hold NUMERIC;
  v_transaction_id UUID;
BEGIN
  -- Lock the row
  SELECT id, available_balance, hold_balance INTO v_wallet_id, v_current_balance, v_current_hold
  FROM public.wallets
  WHERE customer_id = p_customer_id
  FOR UPDATE;

  IF v_wallet_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Wallet not found');
  END IF;

  IF v_current_balance < p_amount THEN
    INSERT INTO public.wallet_transactions (wallet_id, amount, transaction_type, description, reference_id, status)
    VALUES (v_wallet_id, -p_amount, 'shipping_deposit_hold', 'Failed: Hold shipping deposit for package ' || p_package_id || ' (Insufficient funds)', p_package_id, 'failed');
    
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient wallet balance for shipping deposit.');
  END IF;

  -- Move from available to hold
  UPDATE public.wallets
  SET available_balance = v_current_balance - p_amount,
      hold_balance = COALESCE(v_current_hold, 0) + p_amount
  WHERE id = v_wallet_id;

  INSERT INTO public.wallet_transactions (wallet_id, amount, transaction_type, description, reference_id, status)
  VALUES (v_wallet_id, -p_amount, 'shipping_deposit_hold', 'Hold shipping deposit for package ' || p_package_id, p_package_id, 'completed')
  RETURNING id INTO v_transaction_id;

  RETURN jsonb_build_object('success', true, 'transaction_id', v_transaction_id);
END;
$$;

-- 3. Resolve Shipping Hold
CREATE OR REPLACE FUNCTION resolve_shipping_hold_atomic(
  p_customer_id UUID,
  p_held_amount NUMERIC,
  p_actual_cost NUMERIC,
  p_package_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_id UUID;
  v_current_balance NUMERIC;
  v_current_hold NUMERIC;
  v_refund_amount NUMERIC;
  v_deficit NUMERIC;
BEGIN
  SELECT id, available_balance, hold_balance INTO v_wallet_id, v_current_balance, v_current_hold
  FROM public.wallets
  WHERE customer_id = p_customer_id
  FOR UPDATE;

  IF v_wallet_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Wallet not found');
  END IF;

  -- Remove the hold
  UPDATE public.wallets
  SET hold_balance = GREATEST(COALESCE(v_current_hold, 0) - p_held_amount, 0)
  WHERE id = v_wallet_id;

  IF p_actual_cost <= p_held_amount THEN
    -- Refund the difference
    v_refund_amount := p_held_amount - p_actual_cost;
    
    UPDATE public.wallets
    SET available_balance = available_balance + v_refund_amount
    WHERE id = v_wallet_id;
    
    IF v_refund_amount > 0 THEN
      INSERT INTO public.wallet_transactions (wallet_id, amount, transaction_type, description, reference_id, status)
      VALUES (v_wallet_id, v_refund_amount, 'shipping_deposit_refund', 'Refund remaining deposit for package ' || p_package_id, p_package_id, 'completed');
    END IF;
    
    RETURN jsonb_build_object('success', true);
  ELSE
    -- Cost was higher than hold, attempt to deduct the deficit
    v_deficit := p_actual_cost - p_held_amount;
    
    IF v_current_balance < v_deficit THEN
      -- Failed deficit deduction (Log it but maybe system state is tricky here, frontend should handle this)
      INSERT INTO public.wallet_transactions (wallet_id, amount, transaction_type, description, reference_id, status)
      VALUES (v_wallet_id, -v_deficit, 'shipping_deficit_payment', 'Failed: Pay shipping deficit for package ' || p_package_id || ' (Insufficient funds)', p_package_id, 'failed');
      
      RETURN jsonb_build_object('success', false, 'error', 'Insufficient funds to cover shipping deficit');
    END IF;
    
    -- Deduct deficit
    UPDATE public.wallets
    SET available_balance = available_balance - v_deficit
    WHERE id = v_wallet_id;
    
    INSERT INTO public.wallet_transactions (wallet_id, amount, transaction_type, description, reference_id, status)
    VALUES (v_wallet_id, -v_deficit, 'shipping_deficit_payment', 'Pay shipping deficit for package ' || p_package_id, p_package_id, 'completed');
    
    RETURN jsonb_build_object('success', true);
  END IF;
END;
$$;

-- 4. Admin Adjust Wallet Balance
CREATE OR REPLACE FUNCTION admin_adjust_wallet_balance(
  p_wallet_id UUID,
  p_amount NUMERIC,
  p_description TEXT,
  p_reference_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_transaction_id UUID;
  v_new_balance NUMERIC;
BEGIN
  -- Lock the row
  SELECT available_balance + p_amount INTO v_new_balance
  FROM public.wallets
  WHERE id = p_wallet_id
  FOR UPDATE;

  IF v_new_balance IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Wallet not found');
  END IF;

  UPDATE public.wallets
  SET available_balance = v_new_balance
  WHERE id = p_wallet_id;

  INSERT INTO public.wallet_transactions (wallet_id, amount, transaction_type, description, reference_id, status)
  VALUES (p_wallet_id, p_amount, 'admin_adjustment', p_description, p_reference_id, 'completed')
  RETURNING id INTO v_transaction_id;

  RETURN jsonb_build_object('success', true, 'transaction_id', v_transaction_id, 'new_balance', v_new_balance);
END;
$$;

-- 5. Sweep Abandoned Transactions
CREATE OR REPLACE FUNCTION sweep_abandoned_transactions()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  WITH updated_rows AS (
    UPDATE public.wallet_transactions
    SET status = 'failed',
        description = 'Failed: Expired (Timeout)'
    WHERE status = 'pending'
      AND transaction_type = 'top_up'
      AND created_at < NOW() - INTERVAL '24 hours'
    RETURNING id
  )
  SELECT count(*) INTO v_count FROM updated_rows;

  RETURN jsonb_build_object('success', true, 'swept_count', v_count);
END;
$$;
