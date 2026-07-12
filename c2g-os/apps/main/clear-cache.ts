import { createClient } from '@supabase/supabase-js';

async function run() {
  const supabase = createClient(
    "https://ozhyflsobsoaypihwrco.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHlmbHNvYnNvYXlwaWh3cmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk3OTA0OCwiZXhwIjoyMDczNTU1MDQ4fQ.hoshf6CLSMUciJCFfSVa-ZK8LadP3cxX21GOCm4EMLA"
  );
  
  console.log("Clearing cache...");
  // Clear all cached searches to force a fresh fetch from AliExpress API
  const { error } = await supabase
    .from('search_query_cache')
    .delete()
    .neq('query_hash', 'dummy'); // Deletes everything

  if (error) {
    console.error("Failed to clear cache:", error);
  } else {
    console.log("Cache cleared successfully!");
  }
}

run();
