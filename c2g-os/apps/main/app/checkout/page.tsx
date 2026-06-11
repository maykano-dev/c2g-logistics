import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CheckoutClient from "../../components/shop/checkout-client";

export const metadata = {
  title: "Secure Checkout | C2G Mall",
};

export default async function CheckoutPage() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    // Save intended destination for post-login redirection
    redirect(`/login?redirect=/checkout`);
  }

  const { data: profile } = await supabase
    .from("customers")
    .select("name, phone, email")
    .eq("id", userData.user.id)
    .single();

  let exchangeRate = 1;
  const { data: settingsData } = await supabase.from('settings').select('rate_shop_products').eq('id', 1).single();
  if (settingsData && settingsData.rate_shop_products) {
    exchangeRate = parseFloat(settingsData.rate_shop_products);
  } else {
    const { data: sysData } = await supabase.from('system_settings').select('value').eq('key', 'exchange_rate_cny_ghs').single();
    if (sysData && sysData.value) {
      exchangeRate = parseFloat(sysData.value);
    }
  }

  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Secure Checkout</h1>
          <p className="text-muted-foreground mt-2">Enter your delivery details and proceed to secure payment.</p>
        </div>

        <CheckoutClient initialProfile={profile} exchangeRate={exchangeRate} />
      </div>
    </div>
  );
}
