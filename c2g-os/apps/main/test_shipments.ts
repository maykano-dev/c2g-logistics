import { createAdminClient } from './utils/supabase/admin';

async function test() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('shipments').select('*').order('created_at', { ascending: false });
  console.log("Error:", error);
  console.log("Shipments count:", data?.length);
  if (data && data.length > 0) {
    console.log("First shipment:", data[0]);
  }
}
test();
