const URL = "https://ozhyflsobsoaypihwrco.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHlmbHNvYnNvYXlwaWh3cmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk3OTA0OCwiZXhwIjoyMDczNTU1MDQ4fQ.hoshf6CLSMUciJCFfSVa-ZK8LadP3cxX21GOCm4EMLA";

async function main() {
  const res = await fetch(`${URL}/rest/v1/?apikey=${KEY}`);
  const spec = await res.json();
  
  console.log("Tables:");
  for (const table of Object.keys(spec.definitions || {})) {
    console.log(`- ${table}`);
  }
}

main().catch(console.error);
