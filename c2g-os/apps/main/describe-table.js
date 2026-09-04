const URL = "https://ozhyflsobsoaypihwrco.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHlmbHNvYnNvYXlwaWh3cmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk3OTA0OCwiZXhwIjoyMDczNTU1MDQ4fQ.hoshf6CLSMUciJCFfSVa-ZK8LadP3cxX21GOCm4EMLA";

async function main() {
  const query = `
    SELECT tgname, proname, prosrc 
    FROM pg_trigger
    JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
    WHERE tgrelid = 'public.ecom_orders'::regclass;
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
  
  console.log(await res.text());
}

main().catch(console.error);
