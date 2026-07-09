import { createHash } from 'crypto';

const APP_KEY = "538994";
const APP_SECRET = "F6hz1FFs8FlXmEGuigr9r7HXMLQ5sRuQ";
const SESSION = "50000700a01Ok1c2f26cavAgAp0RvfZYo2FlTcTpEXBjTgMuzHokum4iRt3SHOds7YY2";
const GATEWAY = "https://api-sg.aliexpress.com/sync";

async function run() {
  const method = "aliexpress.ds.text.search";
  const params = {
    app_key: APP_KEY,
    session: SESSION,
    method: method,
    sign_method: "md5",
    timestamp: Date.now().toString(),
    keyWord: "ladies bag",
    pageNo: "1",
    pageSize: "20",
    currency: "USD",
    countryCode: "GH",
    shipToCountry: "GH",
    local: "en_US"
  };

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
  
  const data = await res.json();
  // print keys of data.aliexpress_ds_text_search_response.data
  const aeData = data?.aliexpress_ds_text_search_response?.data;
  console.log("aeData keys:", Object.keys(aeData || {}));
  console.log("totalCount:", aeData?.totalCount || aeData?.total_record_count);
  console.log("pageSize:", aeData?.pageSize);
  console.log("products length:", aeData?.products?.selection_search_product?.length || aeData?.products?.length || 0);
  console.log("first item:", JSON.stringify(aeData?.products?.selection_search_product?.[0] || aeData?.products?.[0] || null).substring(0, 500));
}
run();
