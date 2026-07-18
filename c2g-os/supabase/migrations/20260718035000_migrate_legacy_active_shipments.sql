-- Migration: Wrap legacy active shipments and link orders into shipment_reservations

DO $$
DECLARE
    r RECORD;
    new_res_id TEXT;
    mapped_mode TEXT;
    mapped_status TEXT;
BEGIN
    -- 1. Migrate legacy shipments
    FOR r IN 
        SELECT * FROM public.shipments 
        WHERE status IN ('in_transit', 'in-transit', 'shipped', 'clearing_customs', 'clearing-customs', 'ready_for_pickup', 'ready-for-pickup', 'arrived', 'delivered')
        AND reservation_id IS NULL
    LOOP
        new_res_id := 'RES-LEGACY-' || left(replace(gen_random_uuid()::text, '-', ''), 8);
        
        IF lower(r.method) = 'sea' THEN
            mapped_mode := 'sea';
        ELSE
            mapped_mode := 'air_normal';
        END IF;

        IF r.status IN ('in_transit', 'in-transit', 'shipped') THEN
            mapped_status := 'in_transit';
        ELSIF r.status IN ('clearing_customs', 'clearing-customs', 'arrived') THEN
            mapped_status := 'arrived_ghana';
        ELSIF r.status IN ('ready_for_pickup', 'ready-for-pickup') THEN
            mapped_status := 'ready_for_pickup';
        ELSIF r.status = 'delivered' THEN
            mapped_status := 'completed';
        ELSE
            mapped_status := 'in_transit';
        END IF;

        INSERT INTO public.shipment_reservations (
            id, customer_id, shipping_mode, deposit_amount, deposit_paid,
            total_items, status, tracking_number, final_shipping_cost,
            created_at, updated_at
        ) VALUES (
            new_res_id, r.customer_id, mapped_mode, 0.00, true,
            1, mapped_status, r.tracking_number, NULLIF(trim(r.shipping_cost::TEXT), '')::NUMERIC,
            r.created_at, now()
        );

        UPDATE public.shipments SET reservation_id = new_res_id WHERE id = r.id;
    END LOOP;

    -- 2. Migrate legacy link orders
    FOR r IN 
        SELECT * FROM public.orders 
        WHERE type = 'link_order'
        AND order_status IN ('in_transit', 'in-transit', 'shipped', 'clearing_customs', 'clearing-customs', 'ready_for_pickup', 'ready-for-pickup', 'arrived', 'delivered')
        AND reservation_id IS NULL
    LOOP
        new_res_id := 'RES-LEGACY-' || left(replace(gen_random_uuid()::text, '-', ''), 8);
        
        IF lower(r.shipping_mode) = 'sea' THEN
            mapped_mode := 'sea';
        ELSE
            mapped_mode := 'air_normal';
        END IF;

        IF r.order_status IN ('in_transit', 'in-transit', 'shipped') THEN
            mapped_status := 'in_transit';
        ELSIF r.order_status IN ('clearing_customs', 'clearing-customs', 'arrived') THEN
            mapped_status := 'arrived_ghana';
        ELSIF r.order_status IN ('ready_for_pickup', 'ready-for-pickup') THEN
            mapped_status := 'ready_for_pickup';
        ELSIF r.order_status = 'delivered' THEN
            mapped_status := 'completed';
        ELSE
            mapped_status := 'in_transit';
        END IF;

        INSERT INTO public.shipment_reservations (
            id, customer_id, shipping_mode, deposit_amount, deposit_paid,
            total_items, status, tracking_number, final_shipping_cost,
            created_at, updated_at
        ) VALUES (
            new_res_id, r.customer_id, mapped_mode, 0.00, true,
            1, mapped_status, NULL, NULLIF(trim(r.shipping_cost::TEXT), '')::NUMERIC,
            r.created_at, now()
        );

        UPDATE public.orders SET reservation_id = new_res_id WHERE id = r.id;
    END LOOP;
END $$;
