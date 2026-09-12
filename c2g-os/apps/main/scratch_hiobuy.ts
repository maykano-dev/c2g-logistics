import { getProductDetail } from "./lib/hiobuy";

async function run() {
  const res = await getProductDetail({ channel: "1688", id: "1064207824757" });
  console.log(JSON.stringify(res, null, 2));
}
run();
