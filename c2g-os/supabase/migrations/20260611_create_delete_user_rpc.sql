-- Create RPC function to allow users to securely delete their own account
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void AS $$
BEGIN
    -- Only allow the authenticated user to delete their own account
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Delete user from auth.users (this will cascade to customers and other tables)
    DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
