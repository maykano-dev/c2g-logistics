#!/bin/bash
source .env.local

curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/settings?limit=1" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
