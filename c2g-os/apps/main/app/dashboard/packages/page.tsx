import { getPackages } from "./actions";
import PackagesClient from "./packages-client";

export default async function PackagesPage() {
  const packages = await getPackages();

  return <PackagesClient packages={packages} />;
}
