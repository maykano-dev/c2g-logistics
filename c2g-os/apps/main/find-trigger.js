// Find all triggers on ecom_orders and their source code
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHlmbHNvYnNvYXlwaWh3cmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk3OTA0OCwiZXhwIjoyMDczNTU1MDQ4fQ.hoshf6CLSMUciJCFfSVa-ZK8LadP3cxX21GOCm4EMLA";
const BASE = "https://ozhyflsobsoaypihwrco.supabase.co";

// Use the Supabase Management API to get trigger info
// OR use the pg_trigger system table via RPC
async function queryViaSQL(sql) {
  const res = await fetch(`${BASE}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ sql })
  });
  return res.text();
}

// Alternative: directly query pg_catalog
async function getTriggersViaSelect() {
  const res = await fetch(`${BASE}/rest/v1/`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, Accept: "application/json" }
  });
  const spec = await res.json();
  
  // Get the function source for notify_admins_trigger
  const r2 = await fetch(`${BASE}/rest/v1/rpc/pg_get_functiondef?funcname=notify_admins_trigger`, {
    method: "POST",
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  console.log("notify_admins_trigger def:", await r2.text());
}

// Try to get all triggers on ecom_orders via information_schema
async function getAllTriggers() {
  const res = await fetch(`${BASE}/rest/v1/information_schema.triggers?table_name=eq.ecom_orders&select=trigger_name,event_manipulation,action_statement`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, Accept: "application/json" }
  });
  console.log("Triggers from information_schema:", await res.text());
}

// Try Supabase DB API
async function getProcSource() {
  const queries = [
    // Get all trigger functions linked to ecom_orders
    `${BASE}/rest/v1/pg_catalog.pg_trigger?tgrelid=eq.ecom_orders::regclass`,
    // Check if there's an auto_confirm or other trigger
    `${BASE}/rest/v1/pg_trigger?tgname=like.*ecom*`,
  ];
  
  for (const url of queries) {
    const res = await fetch(url, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
    });
    console.log(`\n${url}:\n`, await res.text());
  }
}

// Use the Admin API to list database functions
async function listFunctions() {
  const res = await fetch(`${BASE}/rest/v1/pg_proc?proname=like.*ecom*&select=proname,prosrc`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
  });
  console.log("Functions with 'ecom' in name:", await res.text());
}

// Try posting to a known RPC to see if we can get trigger source
async function getTriggerSource() {
  // The real source of notify_admins_trigger - let's check if it references service_fee_applicable
  // We already viewed the SQL file and it doesn't. So there must be ANOTHER trigger.
  
  // Let's try to get all functions that reference 'service_fee_applicable'
  const res = await fetch(`${BASE}/rest/v1/pg_proc?select=proname,prosrc&prosrc=like.*service_fee_applicable*`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
  });
  console.log("\nFunctions referencing service_fee_applicable:", await res.text());
}

(async () => {
  await getAllTriggers();
  await getTriggerSource();
  await listFunctions();
})();
