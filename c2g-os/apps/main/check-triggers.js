const URL = "https://ozhyflsobsoaypihwrco.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHlmbHNvYnNvYXlwaWh3cmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk3OTA0OCwiZXhwIjoyMDczNTU1MDQ4fQ.hoshf6CLSMUciJCFfSVa-ZK8LadP3cxX21GOCm4EMLA";

async function main() {
  const query = `
    SELECT trigger_name, event_manipulation, event_object_table, action_statement
    FROM information_schema.triggers
    WHERE event_object_table = 'ecom_orders';
  `;
  
  const res = await fetch(`${URL}/rest/v1/rpc/run_sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": KEY,
      "Authorization": `Bearer ${KEY}`
    },
    body: JSON.stringify({ query: query })
  });
  
  // Since we don't have run_sql easily, maybe we can query pg_trigger directly.
  // Wait, I can just create a Node script that uses the Supabase postgres connection string!
}

main().catch(console.error);
