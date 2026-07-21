#!/bin/bash
source .env.local

curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/orders?payment_reference=in.(C2G-ORDER-1784406509531,C2G-ORDER-1784411889954,C2G-ORDER-1784408306888)&select=id,payment_reference,payment_status,order_status" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
