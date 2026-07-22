#!/bin/bash
source .env.local

curl -s -X OPTIONS "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/announcements" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" | grep -o '"columns":[^}]*'

echo "SHOP_ADS"
curl -s -X OPTIONS "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/shop_ads" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" | grep -o '"columns":[^}]*'

echo "TELEGRAM_BROADCASTS"
curl -s -X OPTIONS "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/telegram_broadcasts" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" | grep -o '"columns":[^}]*'
