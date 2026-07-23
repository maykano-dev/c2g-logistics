#!/bin/bash
source .env.local

# Create a temp order to test the full RPC flow
# Actually let's just check if there's a mismatch - the updated_at changed but payment_status didn't
# This is impossible unless the UPDATE statement only sets updated_at and not payment_status

# Let's check if there's an updated_at trigger on the orders table that fires on ANY update
curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/orders?id=eq.435&select=id,payment_status,order_status,updated_at" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
