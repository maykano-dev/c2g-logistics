#!/bin/bash
source .env.local

# Check if orders table has a tracking_number column and what it looks like
curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/orders?select=id,item_tracking_numbers,customer_name,order_status&item_tracking_numbers=not.is.null&limit=5" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
