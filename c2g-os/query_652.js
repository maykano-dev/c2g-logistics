const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ozhyflsobsoaypihwrco.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHlmbHNvYnNvYXlwaWh3cmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NzkwNDgsImV4cCI6MjA3MzU1NTA0OH0.a8BO3FdWtxA-jbrjjXxnBC962qeOgK032oLhmCpCHlk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('product_variants').select('*').eq('product_id', 652);
  console.log(data);
}
check();
