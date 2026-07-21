#!/bin/bash
source .env.local

curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/orders?customer_name=ilike.*Saeed*&select=id,customer_name,total,payment_status,order_status,created_at&order=created_at.desc&limit=10" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
