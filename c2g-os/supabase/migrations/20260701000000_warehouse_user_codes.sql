-- Create Sequence for unique code generation
CREATE SEQUENCE IF NOT EXISTS c2g_user_code_seq START 1;

-- Add warehouse_code column to customers
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS warehouse_code TEXT UNIQUE;

-- Create function to generate warehouse code
CREATE OR REPLACE FUNCTION generate_warehouse_code(p_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_first_name TEXT;
  v_seq_val BIGINT;
  v_padded_code TEXT;
  v_final_code TEXT;
BEGIN
  -- Extract first name
  IF p_name IS NULL OR trim(p_name) = '' THEN
    v_first_name := 'User';
  ELSE
    -- Take the first word and capitalize the first letter, lowercase the rest
    v_first_name := initcap(split_part(trim(p_name), ' ', 1));
    -- Remove non-alphanumeric characters just in case
    v_first_name := regexp_replace(v_first_name, '[^a-zA-Z0-9]', '', 'g');
    IF v_first_name = '' THEN
      v_first_name := 'User';
    END IF;
  END IF;

  -- Get next sequence value
  v_seq_val := nextval('c2g_user_code_seq');
  
  -- Pad to at least 5 digits
  v_padded_code := lpad(v_seq_val::text, 5, '0');
  
  v_final_code := v_first_name || v_padded_code;
  
  RETURN v_final_code;
END;
$$;

-- Create a trigger function to automatically generate code on INSERT
CREATE OR REPLACE FUNCTION trg_customers_assign_warehouse_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.warehouse_code IS NULL THEN
    NEW.warehouse_code := generate_warehouse_code(NEW.name);
  END IF;
  RETURN NEW;
END;
$$;

-- Attach trigger
DROP TRIGGER IF EXISTS trg_customers_assign_warehouse_code_on_insert ON public.customers;
CREATE TRIGGER trg_customers_assign_warehouse_code_on_insert
  BEFORE INSERT ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION trg_customers_assign_warehouse_code();

-- Retroactively populate existing users
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN SELECT id, name FROM public.customers WHERE warehouse_code IS NULL LOOP
    UPDATE public.customers
    SET warehouse_code = generate_warehouse_code(rec.name)
    WHERE id = rec.id;
  END LOOP;
END;
$$;

-- Insert the new warehouse address
INSERT INTO public.warehouse_addresses (
    name,
    location,
    address,
    phone,
    is_default
) VALUES (
    'New Guangzhou Warehouse',
    'Guangzhou, China',
    '广州市南沙区环市大道中阳光城丽景湾快宝驿站C2G仓{CODE}贴唛头{CODE}
联系人：仓管
电话：15918654152',
    '15918654152',
    false
);
