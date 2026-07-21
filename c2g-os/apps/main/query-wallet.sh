#!/bin/bash
source .env.local

# Get customer ID
CUSTOMER_ID=$(curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/customers?name=ilike.*Saeed*&select=id" -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" | grep -o '"id":"[^"]*' | head -n 1 | cut -d'"' -f4)

echo "Customer ID: $CUSTOMER_ID"

# Get wallet balance
curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/wallets?customer_id=eq.${CUSTOMER_ID}&select=id,balance" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"

echo ""
echo "Wallet Transactions:"

WALLET_ID=$(curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/wallets?customer_id=eq.${CUSTOMER_ID}&select=id" -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" | grep -o '"id":"[^"]*' | head -n 1 | cut -d'"' -f4)

curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/wallet_transactions?wallet_id=eq.${WALLET_ID}&select=id,transaction_type,amount,status,description,created_at&order=created_at.desc&limit=5" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"

