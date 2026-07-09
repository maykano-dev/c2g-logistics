"use server";

import { createClient } from "@/utils/supabase/server";
import { aliexpressRequest } from "@/lib/aliexpress/client";
import { normalizeProductTitle } from "@/lib/alibaba/text-cleaner";
import crypto from 'crypto';

// ═══════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════
async function getExchangeRate(supabase: any): Promise<number> {
  const { data: settingsData } = await supabase
    .from("settings")
    .select("rate_shop_products")
    .eq("id", 1)
    .single();
  if (settingsData?.rate_shop_products) {
    return parseFloat(settingsData.rate_shop_products);
  }
  const { data: sysData } = await supabase
    .from("system_settings")
    .select("value")
    .eq("key", "exchange_rate_cny_ghs")
    .single();
  if (sysData?.value) {
    return parseFloat(sysData.value);
  }
  return 0.52; // Fallback
}

// Helper to hash query strings for caching
function hashQuery(query: string): string {
  return crypto.createHash('sha256').update(query.trim().toLowerCase()).digest('hex');
}

// Map AliExpress DS search results to our C2G Product UI shape
// Field names from aliexpress.ds.text.search response docs:
//   - product_id             → numeric product ID
//   - product_title          → display name
//   - product_main_image_url → main image URL
//   - target_sale_price      → price in requested currency (USD)
//   - evaluate_score         → rating
function mapAliExpressToC2g(aeProduct: any, exchangeRate: number) {
  const usdPrice = parseFloat(
    aeProduct.targetSalePrice ||
    aeProduct.target_sale_price ||
    aeProduct.salePrice ||
    "0"
  );

  const imageUrl =
    aeProduct.itemMainPic ||
    aeProduct.product_main_image_url ||
    aeProduct.image_url ||
    "https://placehold.co/300";

  return {
    id:                String(aeProduct.itemId || aeProduct.product_id),
    name:              normalizeProductTitle(aeProduct.title || aeProduct.product_title || "Unknown Product"),
    price:             usdPrice,
    selling_price_ghs: usdPrice * exchangeRate,
    image_url:         imageUrl,
    rating:            aeProduct.score || aeProduct.evaluate_score || "0",
    orders:            aeProduct.orders || aeProduct.lastest_volume || 0,
    is_aliexpress:     true, // Flag so frontend knows it's an API product
    // NOTE: product_detail_url intentionally NOT included — white-labeling requirement
  };
}

// ═══════════════════════════════════════════════════════════════════
// Level 1 & 3: Top Purchased / Featured Products (Local DB)
// ═══════════════════════════════════════════════════════════════════
export async function getTopPurchasedProducts(limit: number = 5) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("catalog_type", ["promoted", "featured"])
      .order("purchase_count", { ascending: false })
      .limit(limit);

    if (error) throw error;
    const exchangeRate = await getExchangeRate(supabase);
    
    return {
      success: true,
      products: data?.map((p) => ({
        id: p.id,
        name: p.title,
        price: p.price_snapshot_usd,
        selling_price_ghs: p.price_snapshot_usd * exchangeRate,
        image_url: p.thumbnail_url,
        demandLabel: p.purchase_count > 50 ? "high" : "medium"
      })) || [],
      exchangeRate
    };
  } catch (error: any) {
    console.error("Failed to fetch top purchased products:", error);
    return { success: false, products: [], exchangeRate: 1, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════════
// Level 2: Main Search (Hybrid Smart Gateway)
// ═══════════════════════════════════════════════════════════════════
export async function getShopProducts(params?: {
  category?: string;
  query?: string;
  page?: number;
}) {
  const supabase = await createClient();
  const exchangeRate = await getExchangeRate(supabase);
  const page = params?.page || 1;
  const limit = 20;
  
  let localProducts: any[] = [];
  let alibabaProducts: any[] = [];
  let totalCount = 0;

  // 1. Always fetch from Local Featured/Promoted DB (Level 1 & 3)
  let localQuery = supabase.from("products").select("*", { count: 'exact' });
  
  if (params?.category && params.category !== "all") {
    localQuery = localQuery.eq("category_id", params.category);
  }
  if (params?.query) {
    localQuery = localQuery.ilike("title", `%${params.query}%`);
  }
  
  const from = (page - 1) * limit;
  const { data: localData, count } = await localQuery.range(from, from + limit - 1).order("c2g_trust_score", { ascending: false });
  totalCount += (count || 0);

  localProducts = (localData || []).map((p) => ({
    id: p.id,
    name: p.title,
    price: p.price_snapshot_usd,
    selling_price_ghs: p.price_snapshot_usd * exchangeRate,
    image_url: p.thumbnail_url,
  }));

  // 2. If there is a search query, fetch from Alibaba (Level 2)
  if (params?.query && page === 1) {
    const qHash = hashQuery(params.query);
    
    // Check Search Query Cache first
    const { data: cacheData } = await supabase
      .from("search_query_cache")
      .select("result_data, expires_at")
      .eq("query_hash", qHash)
      .single();

    if (cacheData && new Date(cacheData.expires_at) > new Date()) {
      // CACHE HIT
      alibabaProducts = cacheData.result_data.map((p: any) => mapAliExpressToC2g(p, exchangeRate));
    } else {
      // CACHE MISS → Call AliExpress DS API
      try {
        // aliexpress.ds.text.search — AE Dropshipper product search
        // Params: search_text, sort, page_no, page_size, target_currency, target_language
        const res = await aliexpressRequest({
          apiMethod: 'aliexpress.ds.text.search',
          params: {
            // Confirmed mandatory camelCase params (live tested — see test-ae-sig*.mjs)
            keyWord:       params.query,       // primary search text (camelCase)
            search_text:   params.query,       // keep snake_case alias as fallback
            sort:          'default',
            pageNo:        String(params.page || 1),
            page_no:       String(params.page || 1),
            pageSize:      '20',
            page_size:     '20',
            currency:      'USD',              // mandatory (NOT target_currency)
            local:         'en_US',            // mandatory locale
            countryCode:   'GH',              // mandatory (camelCase)
            shipToCountry: 'GH',              // shipping destination
          }
        });

        // Response shape can vary: Streamlined (res.data.products) OR Wrapped (res.aliexpress_ds_text_search_response.result...)
        const wrapper = res?.aliexpress_ds_text_search_response || res;
        
        let resultList: any[] = [];
        
        if (Array.isArray(wrapper?.data?.products?.selection_search_product)) {
          // New API format structure
          resultList = wrapper.data.products.selection_search_product;
        } else if (Array.isArray(wrapper?.data?.products)) {
          // Fallback legacy Streamlined
          resultList = wrapper.data.products;
        } else if (Array.isArray(wrapper?.result?.item_record_list?.ae_item_search_result_d_t_o)) {
          // Fallback legacy Wrapped
          resultList = wrapper.result.item_record_list.ae_item_search_result_d_t_o;
        } else if (Array.isArray(wrapper?.result?.result_list?.item_info)) {
          // Fallback alternative Wrapped
          resultList = wrapper.result.result_list.item_info;
        } else if (Array.isArray(res?.data?.products?.selection_search_product)) {
           // Direct from res structure
           resultList = res.data.products.selection_search_product;
        } else if (Array.isArray(res?.data?.products)) {
          resultList = res.data.products;
        }

        if (resultList.length > 0) {
          alibabaProducts = resultList.map((p: any) => mapAliExpressToC2g(p, exchangeRate));

          // Save to Cache (TTL 12 hours)
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 12);

          await supabase.from("search_query_cache").upsert({
            query_hash:  qHash,
            query_text:  params.query,
            result_data: resultList,
            expires_at:  expiresAt.toISOString()
          });
        }
      } catch (e) {
        console.error("AliExpress Search Failed, falling back to local only", e);
      }
    }
  }

  // Merge (Local first, then Alibaba)
  // Ensure no duplicates if a product was promoted to local DB but also returned in Alibaba search
  const localIds = new Set(localProducts.map(p => p.id));
  const uniqueAlibaba = alibabaProducts.filter(p => !localIds.has(p.id));

  return { 
    success: true, 
    products: [...localProducts, ...uniqueAlibaba], 
    exchangeRate,
    totalCount: totalCount + uniqueAlibaba.length,
    totalPages: Math.ceil((totalCount + uniqueAlibaba.length) / limit) || 1,
    currentPage: page
  };
}

// ═══════════════════════════════════════════════════════════════════
// Live Product Details (AliExpress DS API)
// ═══════════════════════════════════════════════════════════════════
export async function getProductDetails(id: string) {
  const supabase = await createClient();
  const exchangeRate = await getExchangeRate(supabase);

  try {
    // aliexpress.ds.product.get — AE Dropshipper product detail API
    // Required params: ship_to_country, product_id, target_currency, target_language
    const res = await aliexpressRequest({
      apiMethod: 'aliexpress.ds.product.get',
      params: {
        product_id:      id,
        ship_to_country: 'GH',
        target_currency: 'USD',
        target_language: 'en',
      }
    });

    // Response shape: aliexpress_ds_product_get_response.result
    const raw = res?.aliexpress_ds_product_get_response?.result;
    if (!raw) throw new Error("Product not found on AliExpress");

    // Images: ae_item_sku_info_dtos or ae_multimedia_info_dto
    const mainImages: string[] = (
      raw.ae_multimedia_info_dto?.image_urls?.string ||
      [raw.ae_item_base_info_dto?.subject_trans, raw.ae_item_base_info_dto?.detail]
        .filter(Boolean)
    ).flat().filter((u: any) => typeof u === 'string' && u.startsWith('http'));

    // SKU variants from ae_item_sku_info_dtos.ae_item_sku_info_d_t_o[]
    const skuDefs: any[] = raw.ae_item_sku_info_dtos?.ae_item_sku_info_d_t_o || [];
    const variants = skuDefs.map((sku: any) => {
      const priceUsd = parseFloat(
        sku.sku_price || sku.offer_sale_price || '0'
      );

      // ae_sku_property_dtos → readable combination label like "Color: Black / Size: XL"
      const propParts: string[] = (sku.ae_sku_property_dtos?.ae_sku_property_d_t_o || []).map(
        (prop: any) => `${prop.sku_property_name}: ${prop.property_value_definition_name || prop.sku_property_value}`
      );
      const combination = propParts.length > 0 ? propParts.join(' / ') : 'Standard';

      const skuImageUrl = sku.sku_image || mainImages[0] || '';

      return {
        id:                String(sku.sku_id || 'default'),
        sku_attr:          sku.id,                            // Used when placing DS orders
        combination,
        price:             priceUsd,
        selling_price_ghs: priceUsd * exchangeRate,
        image_url:         skuImageUrl,
        stock:             sku.sk_quantity ?? 999,
      };
    });

    // Fallback: one standard variant if no SKUs
    if (variants.length === 0) {
      const priceUsd = parseFloat(
        raw.ae_item_base_info_dto?.product_price ||
        raw.ae_item_base_info_dto?.app_sale_price ||
        '0'
      );
      variants.push({
        id:                'default',
        sku_attr:          undefined,
        combination:       'Standard',
        price:             priceUsd,
        selling_price_ghs: priceUsd * exchangeRate,
        image_url:         mainImages[0] || '',
        stock:             999,
      });
    }

    const baseInfo = raw.ae_item_base_info_dto || {};
    const mappedProduct = {
      id:          String(baseInfo.product_id || id),
      name:        normalizeProductTitle(baseInfo.subject || baseInfo.title || 'Unknown Product'),
      description: baseInfo.detail || '',
      images:      mainImages.length > 0 ? mainImages : ['https://placehold.co/600'],
      variants,
      category:    baseInfo.category_id,
      rating:      baseInfo.avg_evaluation_rating,
      orders:      baseInfo.lastest_volume,
      trustScore:  90, // AliExpress platform handles seller trust
      trustBadges: ['AliExpress Verified'] as string[],
    };

    // Track View Count (For Auto-Promotion Engine)
    try {
      await supabase.rpc('increment_view_count', { p_id: id });
    } catch (e) {
      // Ignore
    }

    return { success: true, product: mappedProduct, exchangeRate };

  } catch (error: any) {
    console.error("Error fetching AliExpress product details:", error);
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════════
// Trending & New Arrivals (Local DB Only)
// ═══════════════════════════════════════════════════════════════════
export async function getTrendingProducts() {
  return getTopPurchasedProducts(10);
}

export async function getNewArrivals() {
  const supabase = await createClient();
  const exchangeRate = await getExchangeRate(supabase);

  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(12);

  const products = (data || []).map(p => ({
    id: p.id,
    name: p.title,
    price: p.price_snapshot_usd,
    selling_price_ghs: p.price_snapshot_usd * exchangeRate,
    image_url: p.thumbnail_url
  }));

  return { products, exchangeRate };
}

export async function getBestSellers() {
  return getTopPurchasedProducts(15);
}

// ═══════════════════════════════════════════════════════════════════
// Categories
// ═══════════════════════════════════════════════════════════════════
export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("alibaba_categories").select("name");
  return (data || []).map(c => c.name).sort();
}

// ═══════════════════════════════════════════════════════════════════
// Smart Shipping Recommendation
// ═══════════════════════════════════════════════════════════════════
export async function getShippingRecommendation(weightKg?: number, volumeCbm?: number) {
  if (weightKg && weightKg < 5) return { mode: "air", label: "Air Freight Recommended" };
  if (volumeCbm && volumeCbm > 0.5) return { mode: "sea", label: "Sea Freight Recommended" };
  return { mode: "air", label: "Air Freight Recommended" };
}

// ═══════════════════════════════════════════════════════════════════
// Similar Products & Reviews
// ═══════════════════════════════════════════════════════════════════
export async function getSimilarProducts(productId: string, category?: string) {
  if (category) {
    const res = await getShopProducts({ category, page: 1 });
    const filtered = res.products.filter(p => String(p.id) !== productId);
    return { products: filtered.slice(0, 8), exchangeRate: res.exchangeRate };
  }
  return { products: [], exchangeRate: 1 };
}

export async function submitProductReview(productId: string, rating: number, reviewText: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Must be logged in" };

  try {
    const { error } = await supabase.from('product_reviews').insert({
      product_id: productId,
      user_id: user.id,
      rating,
      review_text: reviewText,
      is_approved: false
    });
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit review" };
  }
}

// ═══════════════════════════════════════════════════════════════════
// Wishlist & Cart Sync (UNCHANGED)
// ═══════════════════════════════════════════════════════════════════
export async function getDbCart() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, items: [] };
  const cartData = user.user_metadata?.cart || [];
  return { success: true, items: cartData };
}

export async function syncDbCart(items: any[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };
  const { error } = await supabase.auth.updateUser({ data: { cart: items } });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getDbWishlist() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, items: [] };

  const { data, error } = await supabase
    .from("wishlist")
    .select("product_id, products(id, title, price_snapshot_usd, thumbnail_url)")
    .eq("customer_id", user.id);

  if (error || !data) return { success: false, items: [] };
  const exchangeRate = await getExchangeRate(supabase);

  const items = data.map((row: any) => {
    const p = row.products;
    if (!p) return null;
    return {
      id: String(p.id),
      name: p.title,
      imageUrl: p.thumbnail_url,
      priceGhs: p.price_snapshot_usd * exchangeRate,
      priceCny: 0 
    };
  }).filter(Boolean);

  return { success: true, items };
}

export async function addDbWishlist(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };
  const { error } = await supabase.from("wishlist").insert({ customer_id: user.id, product_id: productId });
  if (error && error.code !== '23505') return { success: false };
  return { success: true };
}

export async function removeDbWishlist(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };
  await supabase.from("wishlist").delete().match({ customer_id: user.id, product_id: productId });
  return { success: true };
}

export async function clearDbWishlist() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false };
  await supabase.from("wishlist").delete().eq("customer_id", user.id);
  return { success: true };
}
