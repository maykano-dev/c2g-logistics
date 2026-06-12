import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import NewProductClient from "./new-product-client";

export const metadata: Metadata = {
  title: "Add Product | Importer Dashboard",
};

export default async function NewProductPage() {
  const supabase = await createClient();

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

  return <NewProductClient exchangeRate={exchangeRate} />;
}
