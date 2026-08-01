-- Delete legacy reservations where they claim to be 'in_transit'
-- but at least one attached package is physically 'in_warehouse'.
-- This releases the packages back to the customer's dashboard.

DELETE FROM public.shipment_reservations sr
WHERE sr.id LIKE 'RES-LEGACY-%'
  AND sr.status = 'in_transit'
  AND EXISTS (
    SELECT 1 FROM public.shipments s 
    WHERE s.reservation_id = sr.id AND s.status = 'in_warehouse'
    UNION ALL
    SELECT 1 FROM public.ecom_orders e 
    WHERE e.reservation_id = sr.id AND e.order_status = 'in_warehouse'
    UNION ALL
    SELECT 1 FROM public.orders o 
    WHERE o.reservation_id = sr.id AND o.order_status = 'in_warehouse'
  );
