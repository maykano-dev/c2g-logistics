import { createHash } from 'crypto';

const APP_KEY = "538994";
const APP_SECRET = "F6hz1FFs8FlXmEGuigr9r7HXMLQ5sRuQ";
const SESSION = "50000700a01Ok1c2f26cavAgAp0RvfZYo2FlTcTpEXBjTgMuzHokum4iRt3SHOds7YY2";
const GATEWAY = "https://api-sg.aliexpress.com/sync";

async function run() {
  const params = {
    app_key: APP_KEY,
    session: SESSION,
    method: "aliexpress.ds.product.get",
    sign_method: "md5",
    timestamp: Date.now().toString(),
    product_id: "1005008130183593",
    target_currency: "USD",
    target_language: "en",
    ship_to_country: "GH"
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
  const raw = data?.aliexpress_ds_product_get_response?.result;
  
  console.log("Base Info:", JSON.stringify(raw?.ae_item_base_info_dto, null, 2));
  console.log("First SKU:", JSON.stringify(raw?.ae_item_sku_info_dtos?.ae_item_sku_info_d_t_o?.[0], null, 2));
}
run();
