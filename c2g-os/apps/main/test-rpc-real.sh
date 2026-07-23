#!/bin/bash
source .env.local

# Test the RPC with the actual order 435 data to see its response
curl -s -X POST "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/pay_link_order_atomic" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Content-Type: application/json" \
-d '{"p_customer_id": "d4e4d219-3e66-4857-97ec-6ff929869a2a", "p_order_id": 435, "p_amount": 0.01, "p_reference_id": "TEST"}'
