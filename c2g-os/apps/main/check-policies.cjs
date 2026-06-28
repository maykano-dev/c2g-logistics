const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
async function run() {
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/query_schema`, { // this doesn't exist
    headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
  });
}
// wait, I can just use psql! wait, psql is not available.
// Is there a way to run arbitrary SQL on remote supabase from the terminal?
// I can use the supabase CLI if it's installed and configured.
