async function run() {
  const url = 'https://api.hiobuy.com/v1/products/detail';
  const body = {
    channel: '1688',
    id: '1064207824757',
    language: 'en',
    response_format: 'standard'
  };
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.HIOBUY_API_KEY}`,
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

run();
