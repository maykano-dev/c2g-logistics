-- Update minimum balance threshold for wallets
ALTER TABLE public.wallets ALTER COLUMN minimum_balance_threshold SET DEFAULT 50.00;
UPDATE public.wallets SET minimum_balance_threshold = 50.00;
