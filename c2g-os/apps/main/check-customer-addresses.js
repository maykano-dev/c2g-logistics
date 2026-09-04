const URL = "https://ozhyflsobsoaypihwrco.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHlmbHNvYnNvYXlwaWh3cmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk3OTA0OCwiZXhwIjoyMDczNTU1MDQ4fQ.hoshf6CLSMUciJCFfSVa-ZK8LadP3cxX21GOCm4EMLA";

async function main() {
  const res = await fetch(`${URL}/rest/v1/?apikey=${KEY}`);
  const spec = await res.json();
  
  const c = spec.definitions?.customer_addresses;
  if (c) {
    console.log("customer_addresses properties:");
    for (const [col, def] of Object.entries(c.properties || {})) {
      console.log(`  ${col}: ${def.type}`);
    }
  } else {
    console.log("customer_addresses not found");
  }
}

main().catch(console.error);
