import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => {
  const match = env.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].replace(/['"]/g, '').trim() : null;
};
const url = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const key = getEnv('SUPABASE_SERVICE_ROLE_KEY');

async function run() {
  const res = await fetch(`${url}/rest/v1/customers?id=eq.0fedc09d-64fe-4e72-a9d8-78c0e32fceb4`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  console.log(await res.json());
}
run();
