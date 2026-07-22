#!/bin/bash
source .env.local

curl -s -X PATCH "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/warehouse_addresses?name=eq.China+Warehouse+Address" \
-H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
-H "Content-Type: application/json" \
-H "Prefer: return=representation" \
-d '{
  "address": "Address Line 1: 迎泽大街79号理工大学迎西校区内太原理工大学(迎西校区)清泽田径场\nCity: 太原市\nProvince: 山西省\nDistrict: 万柏林区\nCountry: China"
}'
