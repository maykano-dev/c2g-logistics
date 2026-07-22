#!/bin/bash
source .env.local

curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/telegram_broadcasts?limit=1" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
echo ""
curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/broadcast_messages?limit=1" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
echo ""
curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/marketing_broadcasts?limit=1" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
