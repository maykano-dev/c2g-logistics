-- Links multiple ecom_orders that were created in the same checkout session
ALTER TABLE public.ecom_orders 
  ADD COLUMN IF NOT EXISTS checkout_group_id UUID,
  ADD COLUMN IF NOT EXISTS seller_name TEXT;

-- Index for fast lookups of sibling orders
CREATE INDEX IF NOT EXISTS idx_ecom_orders_checkout_group 
  ON public.ecom_orders(checkout_group_id) 
  WHERE checkout_group_id IS NOT NULL;
