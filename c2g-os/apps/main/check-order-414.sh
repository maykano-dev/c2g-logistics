#!/bin/bash
source .env.local

# Order 414 WORKED correctly with the new RPC. Let's compare it to 429/430
# 414: reference_id=LNK-414, status=paid ✅
# 429: reference_id=LNK-429, status was pending ❌ 
# 430: reference_id=LNK-430, status was pending ❌
# 435: reference_id=LNK-435, status was pending ❌

# Check the wallet transaction for 414 vs 429
curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/wallet_transactions?reference_id=eq.LNK-414&select=*" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"

echo "---"

curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/wallet_transactions?reference_id=eq.LNK-429&select=*" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
