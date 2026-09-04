const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const key = env.match(/HIOBUY_API_KEY=(.*)/)[1].trim().replace(/"/g, '');

async function run() {
  try {
    const res = await fetch('https://api.hiobuy.com/v1/products/detail', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ channel: '1688', id: '671929355144' })
    });
    const data = await res.json();
    console.log("STATUS:", res.status);
    console.log("DATA KEYS:", Object.keys(data));
    if (data.error) console.log("ERROR:", data.error);
  } catch(e) {
    console.error("FETCH ERROR", e);
  }
}
run();
