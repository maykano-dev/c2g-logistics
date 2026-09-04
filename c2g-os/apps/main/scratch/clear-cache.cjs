const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim().replace(/"/g, '');
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim().replace(/"/g, '');

fetch(`${url}/rest/v1/search_query_cache?query_hash=not.is.null`, {
  method: 'DELETE',
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`
  }
}).then(res => console.log('Cache cleared:', res.status)).catch(console.error);
