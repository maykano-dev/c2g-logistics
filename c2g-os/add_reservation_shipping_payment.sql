-- Add shipping fee payment tracking columns to shipment_reservations table
ALTER TABLE public.shipment_reservations 
ADD COLUMN IF NOT EXISTS shipping_fee_paid BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS shipping_fee_payment_reference TEXT;
