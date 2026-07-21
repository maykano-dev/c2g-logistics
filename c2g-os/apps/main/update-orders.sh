#!/bin/bash
source .env.local

curl -s -X PATCH "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/orders?id=in.(414,420,425)" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Content-Type: application/json" \
-H "Prefer: return=representation" \
-d '{
  "payment_status": "paid",
  "order_status": "processing"
}'
