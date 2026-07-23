#!/bin/bash
source .env.local

# Get a recent unpaid order to inspect its ID type
curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/orders?payment_status=eq.pending&order=created_at.desc&limit=3&select=id,customer_id,total,payment_status,order_status,payment_reference,created_at" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
