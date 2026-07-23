#!/bin/bash
source .env.local

# Since details is JSON or text, we can do an ilike match. URL encoding '武汉'
curl -s -X GET "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/audit_logs?details=ilike.*%E6%AD%A6%E6%B1%89*" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"
