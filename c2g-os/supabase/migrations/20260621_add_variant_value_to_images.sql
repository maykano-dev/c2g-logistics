-- Add variant_value to product_images to associate images with specific variant options
ALTER TABLE public.product_images ADD COLUMN IF NOT EXISTS variant_value text;
