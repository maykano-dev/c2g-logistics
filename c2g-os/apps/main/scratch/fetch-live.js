const https = require('https');
const data = JSON.stringify({
  channel: "1688",
  keyword: "ladies bag",
  page: 1,
  page_size: 1,
  language: "en"
});

const req = https.request('https://api.hiobuy.com/v1/products/search', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer hio_live_6o1q4m6v58481i5a4k5d306i3k0k0j6b5g120k3t1z2z1t05',
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      console.log(JSON.stringify(parsed.items ? parsed.items[0] : parsed, null, 2));
    } catch(e) {
      console.log(body);
    }
  });
});
req.write(data);
req.end();
