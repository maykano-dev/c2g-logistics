"use server";

import { createClient } from "@/utils/supabase/server";

export async function getShopPromotions() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching promotions:", error);
    return { success: false, error: error.message };
  }

  return { success: true, promotions: data };
}

export async function getShopProducts(params?: { category?: string; query?: string }) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(`
      *,
      product_images (
        id,
        image_url,
        is_primary,
        media_type
      ),
      product_variants (
        id,
        sku,
        combination,
        price,
        price_cny,
        stock
      )
    `)
    .eq("is_active", true);

  if (params?.category && params.category !== "all") {
    query = query.ilike("category", `%${params.category}%`);
  }

  if (params?.query) {
    query = query.ilike("name", `%${params.query}%`);
  }

  query = query.limit(100);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: error.message };
  }

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

  return { success: true, products: data, exchangeRate };
}

export async function getProductDetails(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images (
        id,
        image_url,
        is_primary,
        media_type
      ),
      product_variants (
        id,
        sku,
        combination,
        price,
        price_cny,
        stock
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product details:", error);
    return { success: false, error: error.message };
  }

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

  return { success: true, product: data, exchangeRate };
}
