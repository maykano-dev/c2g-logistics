const https = require("https");
https.get("https://qr.1688.com/s/d6ovPSM0", { family: 4, headers: { "User-Agent": "curl/7.68.0" } }, (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => console.log("DATA:", data));
}).on("error", console.error);
