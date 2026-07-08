"use server";

import { createClient } from "@/utils/supabase/server";
import { alibabaRequest } from "@/lib/alibaba/client";
import { filterTrustedProducts, stripSupplierData, calculateTrustScore } from "@/lib/alibaba/trust-filter";
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

// Map Alibaba search results to our C2G Product UI shape
function mapAlibabaToC2g(alibabaProduct: any, exchangeRate: number) {
  // ICBU product list API sometimes omits price in the brief search result, 
  // we will show "View for Price" (price=0) until they click into it.
  const usdPrice = parseFloat(alibabaProduct.price || alibabaProduct.fob_price || "0");
  const imageUrl = alibabaProduct.main_image?.images?.[0] || alibabaProduct.main_image?.url || alibabaProduct.thumbnail_url || "https://placehold.co/300";
  
  return {
    id: alibabaProduct.product_id || alibabaProduct.id,
    name: normalizeProductTitle(alibabaProduct.title || alibabaProduct.subject || "Unknown Product"),
    price: usdPrice,
    selling_price_ghs: usdPrice * exchangeRate,
    image_url: imageUrl,
    is_alibaba: true // Flag so frontend knows it's an API product
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
      alibabaProducts = cacheData.result_data.map((p: any) => mapAlibabaToC2g(p, exchangeRate));
    } else {
      // CACHE MISS -> Call Alibaba API
      try {
        // Use the ICBU product list endpoint for Alibaba.com
        const res = await alibabaRequest({
          apiPath: '/alibaba/icbu/product/list',
          params: { subject: params.query, page_size: 20, current_page: 1 }
        });

        if (res?.result?.products) {
          const rawProducts = res.result.products;
          
          // Trust Filter & Scrubber
          const trusted = await filterTrustedProducts(rawProducts);
          const scrubbed = trusted.map(stripSupplierData);
          
          alibabaProducts = scrubbed.map((p: any) => mapAlibabaToC2g(p, exchangeRate));

          // Save to Cache (TTL 12 hours)
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 12);

          await supabase.from("search_query_cache").upsert({
            query_hash: qHash,
            query_text: params.query,
            result_data: scrubbed,
            expires_at: expiresAt.toISOString()
          });
        }
      } catch (e) {
        console.error("Alibaba Search Failed, falling back to local only", e);
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
// Live Product Details (Alibaba API /eco/buyer/product/description)
// ═══════════════════════════════════════════════════════════════════
export async function getProductDetails(id: string) {
  const supabase = await createClient();
  const exchangeRate = await getExchangeRate(supabase);

  try {
    // Call Alibaba for the live description and variants
    // According to docs, param is 'query_req'
    const descPayload = JSON.stringify({ product_id: id });
    const descRes = await alibabaRequest({
      apiPath: '/eco/buyer/product/description',
      params: { query_req: descPayload }
    });

    const certPayload = JSON.stringify({ product_id: id });
    let certData: any[] = [];
    try {
      const certRes = await alibabaRequest({
        apiPath: '/eco/buyer/product/cert',
        params: { req: certPayload }
      });
      certData = certRes?.result?.result_data || [];
    } catch(e) {
      // Cert failure shouldn't crash the whole page, just lower trust score
      console.warn("Could not fetch certs for", id);
    }

    const rawProduct = descRes?.result?.result_data;
    if (!rawProduct) throw new Error("Product not found on Alibaba");

    // 1. Calculate Trust Score strictly using what's available
    const trustEval = calculateTrustScore(rawProduct, certData);
    if (!trustEval.passed) {
      throw new Error(`This product failed C2G's security and quality checks. (${trustEval.reasons.join(", ")})`);
    }

    // 2. Strip Supplier Info (White-labeling)
    const safeProduct = stripSupplierData(rawProduct);

    // 3. Map to C2G Frontend Structure
    // Convert Alibaba's skus array to our variant format
    const variants = (safeProduct.skus || []).map((sku: any) => {
      const priceUsd = parseFloat(sku.cost_discount_price || sku.total_origin_cost_price || "0");
      const attrs = (sku.sku_attr_list || []).map((a: any) => a.attr_value_desc).join(" / ");
      return {
        id: sku.sku_id,
        combination: attrs,
        price: priceUsd,
        selling_price_ghs: priceUsd * exchangeRate,
        image_url: sku.image,
        stock: 999 // Dropshipping assume stock until live cart check
      };
    });

    const mappedProduct = {
      id: safeProduct.product_id || id,
      name: safeProduct.title,
      description: safeProduct.description,
      images: [safeProduct.main_image, ...(safeProduct.images || [])].filter(Boolean),
      variants,
      wholesale_volume: safeProduct.wholesale_trade?.volume,
      trustScore: trustEval.score,
      trustBadges: certData.map(c => c.cert_name)
    };

    // Track View Count (For Auto-Promotion Engine)
    try {
      await supabase.rpc('increment_view_count', { p_id: id });
    } catch (e) {
      // Ignore
    }

    return { success: true, product: mappedProduct, exchangeRate };

  } catch (error: any) {
    console.error("Error fetching live product details:", error);
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
