#!/bin/bash
source .env.local

curl -s -X PATCH "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/warehouse_addresses?name=eq.China+Warehouse+Address" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Content-Type: application/json" \
-H "Prefer: return=representation" \
-d '{
  "phone": "+86 17835112914"
}'
