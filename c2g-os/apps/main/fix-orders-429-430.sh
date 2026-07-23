#!/bin/bash
source .env.local

# Fix Order 429
curl -s -X PATCH "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/orders?id=eq.429" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Content-Type: application/json" \
-H "Prefer: return=representation" \
-d '{"payment_status": "paid", "order_status": "processing"}' | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Order 429: payment_status={d[0][\"payment_status\"]}, order_status={d[0][\"order_status\"]}')"

# Fix Order 430
curl -s -X PATCH "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/orders?id=eq.430" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Content-Type: application/json" \
-H "Prefer: return=representation" \
-d '{"payment_status": "paid", "order_status": "processing"}' | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Order 430: payment_status={d[0][\"payment_status\"]}, order_status={d[0][\"order_status\"]}')"
