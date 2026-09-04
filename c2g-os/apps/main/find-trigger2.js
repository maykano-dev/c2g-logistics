// Use the Management API or pg_dump approach
// Try to identify triggers via the Supabase DB URL
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHlmbHNvYnNvYXlwaWh3cmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk3OTA0OCwiZXhwIjoyMDczNTU1MDQ4fQ.hoshf6CLSMUciJCFfSVa-ZK8LadP3cxX21GOCm4EMLA";
const BASE = "https://ozhyflsobsoaypihwrco.supabase.co";

// Create a temporary SQL function and call it to inspect the DB
async function createAndCallInspector() {
  // Step 1: Create an RPC function that queries pg_trigger + pg_proc
  const createSQL = `
    CREATE OR REPLACE FUNCTION public.debug_get_ecom_triggers()
    RETURNS TABLE(trigger_name TEXT, function_name TEXT, function_source TEXT)
    LANGUAGE sql
    SECURITY DEFINER
    AS $$
      SELECT 
        t.tgname::TEXT as trigger_name,
        p.proname::TEXT as function_name,
        pg_get_functiondef(p.oid)::TEXT as function_source
      FROM pg_trigger t
      JOIN pg_proc p ON t.tgfoid = p.oid
      WHERE t.tgrelid = 'public.ecom_orders'::regclass
        AND NOT t.tgisinternal;
    $$;
  `;
  
  console.log("Creating inspector function...");
  const createRes = await fetch(`${BASE}/rest/v1/rpc/debug_get_ecom_triggers`, {
    method: "POST",
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  
  const result = await createRes.text();
  console.log("Status:", createRes.status);
  console.log("Result:", result);
}

// Alternative: Use the Supabase Management REST API
async function useManagementAPI() {
  // The management API requires a service role token
  // Try running a query via the SQL endpoint
  const res = await fetch(`${BASE}/rest/v1/rpc/debug_get_ecom_triggers`, {
    method: "POST",
    headers: { 
      apikey: KEY, 
      Authorization: `Bearer ${KEY}`, 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({})
  });
  console.log("debug_get_ecom_triggers:", await res.text());
}

// Approach: use legacy_products table as a proxy hint
async function checkLegacyProducts() {
  const res = await fetch(`${BASE}/rest/v1/legacy_products?select=service_fee_applicable&limit=1`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
  });
  console.log("\nlegacy_products service_fee_applicable:", res.status, await res.text());
}

// Check if there's a trigger that uses legacy_products or products join
async function checkProductsTrigger() {
  // The hint said "Perhaps you meant the table 'public.legacy_products'"
  // So there's a legacy_products table. Let's check its schema
  const res = await fetch(`${BASE}/rest/v1/legacy_products?limit=0`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, Accept: "application/json" }
  });
  console.log("\nlegacy_products response:", res.status, await res.text());
}

(async () => {
  await checkLegacyProducts();
  await checkProductsTrigger();
  await useManagementAPI();
})();
