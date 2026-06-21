const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.rpc('get_table_schema', { table_name: 'product_images' });
  if (error) {
    const { data: d2, error: e2 } = await supabase.from('product_images').select('*').limit(1);
    console.log(d2 && d2.length > 0 ? Object.keys(d2[0]) : "table empty, can't infer schema easily");
  } else {
    console.log(data);
  }
}
check();
