import { getPackages, getRegistrationFee } from "./actions";
import PackagesClient from "./packages-client";
import { getSecureWalletBalance } from "../wallet/shared-actions";

export default async function PackagesPage() {
  const packages = await getPackages();
  const registrationFee = await getRegistrationFee();
  const walletRes = await getSecureWalletBalance();
  const walletBalance = walletRes.available_balance || 0;

  return <PackagesClient packages={packages} walletBalance={walletBalance} registrationFee={registrationFee} />;
}
