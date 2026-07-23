#!/bin/bash
source .env.local

# Check recent wallet transactions to find the one where money was deducted
curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/wallet_transactions?order=created_at.desc&limit=10&select=id,wallet_id,amount,transaction_type,description,reference_id,status,created_at" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
