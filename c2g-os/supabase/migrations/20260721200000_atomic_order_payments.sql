-- Atomic RPCs for paying Link Orders and Mall Orders with Wallet

-- 1. Pay Link Order Atomic
CREATE OR REPLACE FUNCTION pay_link_order_atomic(
  p_customer_id UUID,
  p_order_id BIGINT,
  p_amount NUMERIC,
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
  v_order_status TEXT;
  v_payment_status TEXT;
BEGIN
  -- 1. Check Order Status first
  SELECT order_status, payment_status INTO v_order_status, v_payment_status
  FROM public.orders
  WHERE id = p_order_id AND customer_id = p_customer_id
  FOR UPDATE;

  IF v_order_status IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found');
  END IF;

  IF v_payment_status = 'paid' OR v_payment_status = 'Paid' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order is already paid');
  END IF;

  -- 2. Lock the wallet row for update
  SELECT id, available_balance INTO v_wallet_id, v_current_balance
  FROM public.wallets
  WHERE customer_id = p_customer_id
  FOR UPDATE;

  IF v_wallet_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Wallet not found');
  END IF;

  IF v_current_balance < p_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient wallet balance.');
  END IF;

  -- 3. Deduct balance
  v_new_balance := v_current_balance - p_amount;
  
  UPDATE public.wallets
  SET available_balance = v_new_balance
  WHERE id = v_wallet_id;

  -- 4. Log transaction
  INSERT INTO public.wallet_transactions (wallet_id, amount, transaction_type, description, reference_id, status)
  VALUES (v_wallet_id, -p_amount, 'link_order', 'Payment for Link Order ' || p_reference_id, 'LNK-' || p_order_id, 'completed')
  RETURNING id INTO v_transaction_id;

  -- 5. Update Order
  UPDATE public.orders
  SET payment_status = 'paid',
      order_status = 'processing',
      updated_at = timezone('utc'::text, now())
  WHERE id = p_order_id;

  RETURN jsonb_build_object('success', true, 'transaction_id', v_transaction_id, 'new_balance', v_new_balance);
END;
$$;


-- 2. Pay Mall Order Atomic
CREATE OR REPLACE FUNCTION pay_mall_order_atomic(
  p_customer_id UUID,
  p_order_id TEXT, -- ecom_orders id is UUID but stored as TEXT in some places, wait, let me check the type of ecom_orders id
  p_amount NUMERIC,
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
  v_order_status TEXT;
  v_payment_status TEXT;
  v_uuid_order_id UUID;
BEGIN
  -- Cast p_order_id to UUID
  v_uuid_order_id := p_order_id::UUID;

  -- 1. Check Order Status first
  SELECT order_status, payment_status INTO v_order_status, v_payment_status
  FROM public.ecom_orders
  WHERE id = v_uuid_order_id AND customer_id = p_customer_id
  FOR UPDATE;

  IF v_order_status IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found');
  END IF;

  IF v_payment_status = 'paid' OR v_payment_status = 'Paid' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order is already paid');
  END IF;

  -- 2. Lock the wallet row for update
  SELECT id, available_balance INTO v_wallet_id, v_current_balance
  FROM public.wallets
  WHERE customer_id = p_customer_id
  FOR UPDATE;

  IF v_wallet_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Wallet not found');
  END IF;

  IF v_current_balance < p_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient wallet balance.');
  END IF;

  -- 3. Deduct balance
  v_new_balance := v_current_balance - p_amount;
  
  UPDATE public.wallets
  SET available_balance = v_new_balance
  WHERE id = v_wallet_id;

  -- 4. Log transaction
  INSERT INTO public.wallet_transactions (wallet_id, amount, transaction_type, description, reference_id, status)
  VALUES (v_wallet_id, -p_amount, 'mall_order', 'Payment for Mall Order #' || p_reference_id, 'MALL-' || p_order_id, 'completed')
  RETURNING id INTO v_transaction_id;

  -- 5. Update Order
  UPDATE public.ecom_orders
  SET payment_status = 'paid',
      order_status = 'processing',
      updated_at = timezone('utc'::text, now())
  WHERE id = v_uuid_order_id;

  RETURN jsonb_build_object('success', true, 'transaction_id', v_transaction_id, 'new_balance', v_new_balance);
END;
$$;
