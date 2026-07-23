#!/bin/bash
source .env.local

curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/orders?id=eq.379&select=id,item_tracking_numbers,order_status,customer_name" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
