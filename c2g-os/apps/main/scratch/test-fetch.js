const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const keyMatch = env.match(/HIOBUY_API_KEY=(.*)/);
const apiKey = keyMatch ? keyMatch[1] : null;

fetch('https://api.hiobuy.com/v1/products/search', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    channel: '1688',
    keyword: 'trending',
    page: 1,
    page_size: 1
  })
}).then(res => res.json()).then(data => console.log(JSON.stringify(data.items[0], null, 2))).catch(console.error);
