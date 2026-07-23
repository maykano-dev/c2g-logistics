#!/bin/bash
source .env.local

# Check the wallet owner for 429/430
curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/wallets?id=eq.62a4c837-938f-4e21-b78e-a65f1685da7d&select=id,customer_id,available_balance" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"

echo "---"

# Get orders 429 and 430 customer IDs
curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/orders?id=in.(429,430)&select=id,customer_id,customer_name" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
