#!/bin/bash
source .env.local

curl -s -X POST "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/process_wallet_deduction" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
