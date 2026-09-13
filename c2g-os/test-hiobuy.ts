import { parseProduct } from "./apps/main/lib/hiobuy/client";
import { config } from "dotenv";
config({ path: "./apps/main/.env.local" });

async function test() {
  try {
    const res = await parseProduct({ url: "https://qr.1688.com/s/d6ovPSM0" });
    console.log("Success:", !!res.product);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
