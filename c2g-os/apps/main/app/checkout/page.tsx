import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CheckoutClient from "../../components/shop/checkout-client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Secure Checkout | C2G Mall",
};

export default async function CheckoutPage() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    redirect(`/login?redirect=/checkout`);
  }

  const { data: profile } = await supabase
    .from("customers")
    .select("id, name, phone, email")
    .eq("id", userData.user.id)
    .single();

  let walletBalance = 0;
  if (profile) {
    const { data: wallet } = await supabase
        .from('wallets')
        .select('available_balance')
        .eq('customer_id', profile.id)
        .single();
    if (wallet) {
        walletBalance = Number(wallet.available_balance);
    }
  }

  const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 1).single();

  let exchangeRate = 1;
  if (settingsData && settingsData.rate_shop_products) {
    exchangeRate = parseFloat(settingsData.rate_shop_products);
  } else {
    const { data: sysData } = await supabase.from('system_settings').select('value').eq('key', 'exchange_rate_cny_ghs').single();
    if (sysData && sysData.value) {
      exchangeRate = parseFloat(sysData.value);
    }
  }

  const serviceFeePercentage = settingsData?.service_fee_percentage != null ? parseFloat(settingsData.service_fee_percentage) : 15;
  const minServiceFee = settingsData?.minimum_service_fee != null ? parseFloat(settingsData.minimum_service_fee) : 5;
  const localDeliveryPercentage = settingsData?.local_delivery_percentage != null ? parseFloat(settingsData.local_delivery_percentage) : 0;
  const minLocalDeliveryFee = settingsData?.minimum_local_delivery_fee != null ? parseFloat(settingsData.minimum_local_delivery_fee) : 0;

  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/cart" className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Secure Checkout</h1>
            <p className="text-muted-foreground mt-2">Enter your delivery details and proceed to secure payment.</p>
          </div>
        </div>

        <CheckoutClient 
          initialProfile={profile} 
          exchangeRate={exchangeRate} 
          serviceFeePercentage={serviceFeePercentage}
          minServiceFee={minServiceFee}
          localDeliveryPercentage={localDeliveryPercentage}
          minLocalDeliveryFee={minLocalDeliveryFee}
          walletBalance={walletBalance}
        />
      </div>
    </div>
  );
}
