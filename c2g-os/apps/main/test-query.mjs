import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data, error } = await supabase.from('products').select('*, product_images(*), product_options(*), product_variants(*)').eq('id', 661).single();
console.log('Error:', error);
console.log('Data:', data ? 'Success' : 'No Data');
