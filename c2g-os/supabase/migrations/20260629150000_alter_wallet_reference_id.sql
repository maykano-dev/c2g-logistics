-- Alter reference_id from UUID to TEXT to support string-based Hubtel client references (e.g. WLT-XXXXX)
ALTER TABLE public.wallet_transactions
ALTER COLUMN reference_id TYPE TEXT;
