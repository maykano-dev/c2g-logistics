import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data, error } = await supabase.from('products').select('*').limit(1);
if (data && data.length > 0) {
  console.log(Object.keys(data[0]));
} else {
  console.log("No data or error", error);
}
