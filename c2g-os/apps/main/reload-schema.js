const URL = "https://ozhyflsobsoaypihwrco.supabase.co/rest/v1/rpc/reload_schema"; // Assuming an RPC might exist
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHlmbHNvYnNvYXlwaWh3cmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk3OTA0OCwiZXhwIjoyMDczNTU1MDQ4fQ.hoshf6CLSMUciJCFfSVa-ZK8LadP3cxX21GOCm4EMLA";

async function run() {
  const query = `NOTIFY pgrst, 'reload schema'`;
  const res = await fetch("https://ozhyflsobsoaypihwrco.supabase.co/rest/v1/rpc/run_sql", {
    method: 'POST',
    headers: {
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  console.log(await res.text());
}
run();
