import { config } from "dotenv";
config({ path: "./apps/main/.env.local" });
import { hiobuyFetch } from "./apps/main/lib/hiobuy/client.ts";

async function run() {
  try {
    const res = await hiobuyFetch("/v1/products/detail", { channel: "1688", id: "976445744238" });
    console.log("Success, product title:", res?.product?.title);
  } catch (e) {
    console.error("Failed:", e.message);
  }
}
run();
