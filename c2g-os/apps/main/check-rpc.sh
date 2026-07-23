#!/bin/bash
source .env.local

# Check if pay_link_order_atomic exists
curl -s -X POST "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/pay_link_order_atomic" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Content-Type: application/json" \
-d '{"p_customer_id": "00000000-0000-0000-0000-000000000000", "p_order_id": 0, "p_amount": 0, "p_reference_id": "test"}'
