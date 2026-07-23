#!/bin/bash
source .env.local

# Check payment_status for all orders that have completed wallet transactions
for order_id in 435 430 429 426 414 425 420 405 403 367; do
  result=$(curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}&select=id,payment_status,order_status" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}")
  echo "Order $order_id: $result"
done
