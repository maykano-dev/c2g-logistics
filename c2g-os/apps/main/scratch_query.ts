import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('ecom_orders')
    .select('*')
    .ilike('order_id', '%JE2A')
    .single();
  
  if (error) {
    console.error("DB Error:", error);
  } else {
    console.log("ORDER DATA:", JSON.stringify(data, null, 2));
    
    // Check if we can pull procurement jobs for outer_purchase_id
    const { data: pJob } = await supabase.from('procurement_jobs').select('*').eq('ecom_order_id', data.id).single();
    if (pJob) {
      console.log("PROCUREMENT JOB:", JSON.stringify(pJob, null, 2));
    }
  }
}

run();
