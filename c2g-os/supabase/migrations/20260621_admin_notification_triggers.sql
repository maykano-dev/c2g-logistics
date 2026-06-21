-- Create function to notify all admins
CREATE OR REPLACE FUNCTION notify_admins_trigger() RETURNS TRIGGER AS $$
DECLARE
    admin_record RECORD;
    v_title TEXT;
    v_message TEXT;
    v_type TEXT;
    v_link TEXT;
BEGIN
    -- Determine table and formulate message
    IF TG_TABLE_NAME = 'ecom_orders' THEN
        v_title := 'New Mall Order';
        v_message := 'Order #' || COALESCE(NEW.order_id, 'UNKNOWN') || ' placed by ' || COALESCE(NEW.customer_name, 'Unknown');
        v_type := 'admin_order';
        v_link := '/admin/commerce/mall-orders';
    ELSIF TG_TABLE_NAME = 'orders' THEN
        v_title := 'New Link Order';
        v_message := 'Link Order #' || COALESCE(NEW.id::text, 'UNKNOWN') || ' placed.';
        v_type := 'admin_order';
        v_link := '/admin/commerce/link-orders';
    ELSIF TG_TABLE_NAME = 'shipments' THEN
        v_title := 'New Shipment Registered';
        v_message := 'Tracking #' || COALESCE(NEW.tracking_number, 'UNKNOWN') || ' registered.';
        v_type := 'admin_shipment';
        v_link := '/admin/operations/shipments';
    ELSIF TG_TABLE_NAME = 'customers' THEN
        v_title := 'New Customer Signup';
        v_message := 'User ' || COALESCE(NEW.name, 'Unknown') || ' just signed up.';
        v_type := 'admin_user';
        v_link := '/admin/customers/users';
    END IF;

    -- Insert a notification for each admin
    FOR admin_record IN SELECT user_id FROM admins LOOP
        INSERT INTO notifications (user_id, title, message, type, link)
        VALUES (admin_record.user_id, v_title, v_message, v_type, v_link);
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add triggers
DROP TRIGGER IF EXISTS trigger_notify_admins_ecom_orders ON ecom_orders;
CREATE TRIGGER trigger_notify_admins_ecom_orders
    AFTER INSERT ON ecom_orders
    FOR EACH ROW
    EXECUTE FUNCTION notify_admins_trigger();

DROP TRIGGER IF EXISTS trigger_notify_admins_orders ON orders;
CREATE TRIGGER trigger_notify_admins_orders
    AFTER INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION notify_admins_trigger();

DROP TRIGGER IF EXISTS trigger_notify_admins_shipments ON shipments;
CREATE TRIGGER trigger_notify_admins_shipments
    AFTER INSERT ON shipments
    FOR EACH ROW
    EXECUTE FUNCTION notify_admins_trigger();

DROP TRIGGER IF EXISTS trigger_notify_admins_customers ON customers;
CREATE TRIGGER trigger_notify_admins_customers
    AFTER INSERT ON customers
    FOR EACH ROW
    EXECUTE FUNCTION notify_admins_trigger();
