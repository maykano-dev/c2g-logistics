import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://ozhyflsobsoaypihwrco.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHlmbHNvYnNvYXlwaWh3cmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk3OTA0OCwiZXhwIjoyMDczNTU1MDQ4fQ.hoshf6CLSMUciJCFfSVa-ZK8LadP3cxX21GOCm4EMLA');

async function checkTx() {
  const { data, error } = await supabase
    .from('wallet_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

checkTx();
