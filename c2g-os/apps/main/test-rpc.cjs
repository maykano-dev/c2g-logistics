const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if(parts.length >= 2) {
    const k = parts[0].trim();
    const v = parts.slice(1).join('=').trim().replace(/"/g, '');
    if(k && v) env[k] = v;
  }
});

async function testRpc() {
  const res = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/admin_set_employee_status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify({
      p_employee_id: '82fc2de1-b41e-432f-9bbf-c7a32ae63321', // The pending employee ID from the screenshot
      p_status: 'approved',
      p_notes: '',
      p_staff_role: ''
    })
  });
  
  console.log(res.status, res.statusText);
  const text = await res.text();
  console.log(text);
}

testRpc();
