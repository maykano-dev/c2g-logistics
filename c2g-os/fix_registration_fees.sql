-- Fix legacy shipments where registration_fee_paid was left as false 
-- despite the package status advancing past 'pending_payment'.

UPDATE shipments
SET registration_fee_paid = true
WHERE status IN (
    'awaiting_arrival',
    'in_warehouse',
    'in_transit',
    'in-transit',
    'clearing_customs',
    'ready_for_pickup',
    'delivered'
)
AND (registration_fee_paid = false OR registration_fee_paid IS NULL);
