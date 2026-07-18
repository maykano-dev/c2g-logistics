-- Fix: Restore the correct shipping start dates (updated_at) for legacy reservations

DO $$
DECLARE
    has_start_date BOOLEAN;
BEGIN
    -- Check if shipment_start_date column exists in shipments table
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'shipments' AND column_name = 'shipment_start_date'
    ) INTO has_start_date;

    IF has_start_date THEN
        EXECUTE '
            UPDATE public.shipment_reservations sr
            SET updated_at = COALESCE(s.shipment_start_date, s.updated_at, s.created_at)
            FROM public.shipments s
            WHERE sr.id = s.reservation_id
            AND sr.id LIKE ''RES-LEGACY-%''
        ';
    ELSE
        EXECUTE '
            UPDATE public.shipment_reservations sr
            SET updated_at = COALESCE(s.updated_at, s.created_at)
            FROM public.shipments s
            WHERE sr.id = s.reservation_id
            AND sr.id LIKE ''RES-LEGACY-%''
        ';
    END IF;

    -- Fix dates for link orders too
    EXECUTE '
        UPDATE public.shipment_reservations sr
        SET updated_at = COALESCE(o.updated_at, o.created_at)
        FROM public.orders o
        WHERE sr.id = o.reservation_id
        AND sr.id LIKE ''RES-LEGACY-%''
    ';
END $$;
