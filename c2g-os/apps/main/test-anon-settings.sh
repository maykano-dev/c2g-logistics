#!/bin/bash
source .env.local

curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/settings?limit=1" \
-H "apikey: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
-H "Authorization: Bearer ${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
