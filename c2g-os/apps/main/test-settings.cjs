const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ozhyflsobsoaypihwrco.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aHlmbHNvYnNvYXlwaWh3cmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NzkwNDgsImV4cCI6MjA3MzU1NTA0OH0.a8BO3FdWtxA-jbrjjXxnBC962qeOgK032oLhmCpCHlk');
async function test() {
  const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
  console.log(data, error);
}
test();
