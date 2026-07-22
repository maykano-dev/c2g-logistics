#!/bin/bash
source .env.local

curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/warehouse_addresses?select=address,phone,name" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
