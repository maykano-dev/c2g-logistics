import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data, error } = await supabase.from('customers').select('*').eq('id', '0fedc09d-64fe-4e72-a9d8-78c0e32fceb4').single();
  console.log("Data:", data ? "FOUND" : "NULL");
  console.log("Error:", error);
}
run();
