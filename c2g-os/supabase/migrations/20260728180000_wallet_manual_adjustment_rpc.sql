-- Create RPC function for atomic manual wallet adjustments by admins
CREATE OR REPLACE FUNCTION admin_adjust_wallet_balance(
  p_wallet_id UUID,
  p_amount NUMERIC,
  p_type TEXT,
  p_description TEXT,
  p_reference_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_balance NUMERIC;
  v_new_balance NUMERIC;
BEGIN
  -- Validate type
  IF p_type NOT IN ('top_up', 'withdrawal') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid adjustment type');
  END IF;

  -- Lock the wallet row to prevent concurrent balance updates
  SELECT available_balance INTO v_current_balance
  FROM public.wallets
  WHERE id = p_wallet_id
  FOR UPDATE;

  IF v_current_balance IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Wallet not found');
  END IF;

  -- Calculate new balance
  IF p_type = 'top_up' THEN
    v_new_balance := v_current_balance + p_amount;
  ELSE
    v_new_balance := v_current_balance - p_amount;
  END IF;

  IF v_new_balance < 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient wallet balance for deduction');
  END IF;

  -- Perform the adjustment
  UPDATE public.wallets
  SET available_balance = v_new_balance
  WHERE id = p_wallet_id;

  -- Insert transaction log
  INSERT INTO public.wallet_transactions (
    wallet_id,
    amount,
    transaction_type,
    status,
    reference_id,
    description
  ) VALUES (
    p_wallet_id,
    CASE WHEN p_type = 'top_up' THEN p_amount ELSE -p_amount END,
    p_type,
    'completed',
    p_reference_id,
    p_description
  );

  RETURN jsonb_build_object('success', true, 'new_balance', v_new_balance);
END;
$$;
