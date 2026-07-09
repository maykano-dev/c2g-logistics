import { createHash } from 'crypto';

const APP_KEY = "538994";
const APP_SECRET = "F6hz1FFs8FlXmEGuigr9r7HXMLQ5sRuQ";
const SESSION = "50000700a01Ok1c2f26cavAgAp0RvfZYo2FlTcTpEXBjTgMuzHokum4iRt3SHOds7YY2";
const GATEWAY = "https://api-sg.aliexpress.com/sync";

async function run() {
  const method = "aliexpress.ds.category.get";
  const params = {
    app_key: APP_KEY,
    session: SESSION,
    method: method,
    sign_method: "md5",
    timestamp: Date.now().toString(),
  };

  // Sign
  const sortedKeys = Object.keys(params).sort();
  let signString = "";
  for (const key of sortedKeys) {
    signString += key + params[key];
  }
  const fullString = APP_SECRET + signString + APP_SECRET;
  const signature = createHash('md5').update(fullString, 'utf8').digest('hex').toUpperCase();
  params.sign = signature;

  const url = new URL(GATEWAY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }
  });
  
  const text = await res.text();
  console.log(text);
}
run();
