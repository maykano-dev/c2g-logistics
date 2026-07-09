import { createHash } from 'crypto';

const APP_KEY = "538994";
const APP_SECRET = "F6hz1FFs8FlXmEGuigr9r7HXMLQ5sRuQ";
const SESSION = "50000700a01Ok1c2f26cavAgAp0RvfZYo2FlTcTpEXBjTgMuzHokum4iRt3SHOds7YY2";
const GATEWAY = "https://api-sg.aliexpress.com/sync";

async function run() {
  const params = {
    app_key: APP_KEY,
    session: SESSION,
    method: "aliexpress.ds.image.search",
    sign_method: "md5",
    timestamp: Date.now().toString(),
    shpt_to: "GH",
    target_currency: "USD",
    target_language: "EN",
    sort: "default"
  };

  const sortedKeys = Object.keys(params).sort();
  let signString = "";
  for (const key of sortedKeys) {
    if (params[key] !== "") signString += key + params[key];
  }
  const fullString = APP_SECRET + signString + APP_SECRET;
  const signature = createHash('md5').update(fullString, 'utf8').digest('hex').toUpperCase();
  params.sign = signature;

  const url = new URL(GATEWAY);
  Object.entries(params).forEach(([k, v]) => {
     if (v !== "") url.searchParams.append(k, v);
  });

  const formData = new FormData();
  // Provide a tiny 1x1 png byte string
  const tinyPngHex = "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000b49444154785e636000020000050001e9e289180000000049454e44ae426082";
  const buffer = Buffer.from(tinyPngHex, "hex");
  const blob = new Blob([buffer], { type: 'image/png' });
  formData.append("image_file_bytes", blob, "image.png");

  const res = await fetch(url.toString(), {
    method: 'POST',
    body: formData
  });
  
  const data = await res.json();
  console.log("RESPONSE:", JSON.stringify(data).substring(0, 500));
}
run();
