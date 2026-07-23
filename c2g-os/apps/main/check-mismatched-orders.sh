#!/bin/bash
source .env.local

# Find orders that have a completed wallet transaction but still show pending payment
# Get all link_order wallet transactions
curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/wallet_transactions?transaction_type=eq.link_order&status=eq.completed&select=reference_id,amount,created_at&order=created_at.desc" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
