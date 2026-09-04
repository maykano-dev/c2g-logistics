const URL = "https://ozhyflsobsoaypihwrco.supabase.co/rest/v1/ecom_orders";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHlmbHNvYnNvYXlwaWh3cmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk3OTA0OCwiZXhwIjoyMDczNTU1MDQ4fQ.hoshf6CLSMUciJCFfSVa-ZK8LadP3cxX21GOCm4EMLA";

async function run() {
  const res = await fetch("https://ozhyflsobsoaypihwrco.supabase.co/rest/v1/?apikey=" + KEY, {
    method: 'GET',
    headers: {
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`
    }
  });
  console.log(await res.text());
}
run();
