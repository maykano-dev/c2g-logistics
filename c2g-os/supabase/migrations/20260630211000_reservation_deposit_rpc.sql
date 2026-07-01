-- Create an RPC to safely pay the shipment reservation deposit
CREATE OR REPLACE FUNCTION process_reservation_deposit_atomic(
  p_reservation_id TEXT,
  p_wallet_id UUID,
  p_deposit_amount NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_res_status TEXT;
  v_res_paid BOOLEAN;
  v_customer_id UUID;
  v_current_balance NUMERIC;
  v_new_balance NUMERIC;
BEGIN
  -- 1. Lock the reservation
  SELECT status, deposit_paid, customer_id INTO v_res_status, v_res_paid, v_customer_id
  FROM public.shipment_reservations
  WHERE id = p_reservation_id
  FOR UPDATE;

  IF v_res_status IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Reservation not found');
  END IF;

  IF v_res_paid THEN
    RETURN jsonb_build_object('success', false, 'error', 'Deposit already paid');
  END IF;

  -- 2. Lock the wallet
  SELECT available_balance INTO v_current_balance
  FROM public.wallets
  WHERE id = p_wallet_id AND customer_id = v_customer_id
  FOR UPDATE;

  IF v_current_balance IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Wallet not found or unauthorized');
  END IF;

  IF v_current_balance < p_deposit_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient wallet balance');
  END IF;

  -- 3. Deduct from wallet
  v_new_balance := v_current_balance - p_deposit_amount;
  UPDATE public.wallets SET available_balance = v_new_balance WHERE id = p_wallet_id;

  -- 4. Record wallet transaction
  INSERT INTO public.wallet_transactions (
    wallet_id, amount, transaction_type, status, description, reference_id
  ) VALUES (
    p_wallet_id,
    p_deposit_amount,
    'payment',
    'completed',
    'Shipment Reservation Deposit Paid for ' || p_reservation_id,
    p_reservation_id
  );

  -- 5. Update Reservation
  UPDATE public.shipment_reservations
  SET deposit_paid = TRUE,
      deposit_amount = p_deposit_amount,
      status = 'reserved_for_shipment',
      updated_at = NOW()
  WHERE id = p_reservation_id;

  -- 6. Update linked items to reserved status
  UPDATE public.shipments SET status = 'reserved_for_shipment' WHERE reservation_id = p_reservation_id;
  UPDATE public.orders SET order_status = 'reserved_for_shipment' WHERE reservation_id = p_reservation_id;
  UPDATE public.ecom_orders SET order_status = 'reserved_for_shipment' WHERE reservation_id = p_reservation_id;

  RETURN jsonb_build_object('success', true, 'new_balance', v_new_balance);
END;
$$;
