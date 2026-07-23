#!/bin/bash
source .env.local

# First, let's manually fix the order status right now
curl -s -X PATCH "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/orders?id=eq.435" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Content-Type: application/json" \
-H "Prefer: return=representation" \
-d '{"payment_status": "paid", "order_status": "processing"}'
