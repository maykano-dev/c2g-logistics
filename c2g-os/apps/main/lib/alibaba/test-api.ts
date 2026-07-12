import { alibabaRequest } from "./client";

async function run() {
  const productId = "1600868848416"; // Let's use a real or dummy product ID. Wait, this might be invalid. Let's try it anyway.
  console.log("Testing getProductDescription for", productId);
  try {
    const res = await alibabaRequest({
      apiMethod: '/eco/buyer/product/description',
      httpMethod: 'GET',
      params: { product_id: productId },
      accessToken: '50000100528UUobrNExlmCr3nQgaak1fLuhxQefE13b6cdb6jsiMsthkjsenU5'
    });
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
