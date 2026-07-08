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
// Field names are from the official alibaba.icbu.product.list response docs:
//   - subject       → product name (NOT "title")
//   - product_id    → obfuscated string ID (used for alibaba.icbu.product.get calls)
//   - id            → numeric plain ID
//   - main_image.images[] → array of image URL strings
//   - wholesale_trade.price / sourcing_trade.fob_min_price → USD price
function mapAlibabaToC2g(alibabaProduct: any, exchangeRate: number) {
  // Price: brief list response often omits price — show 0 until user views detail page
  const usdPrice = parseFloat(
    alibabaProduct.wholesale_trade?.price ||
    alibabaProduct.sourcing_trade?.fob_min_price ||
    alibabaProduct.price ||
    "0"
  );
  // Image: main_image.images is an array of strings per docs
  const imageUrl = (alibabaProduct.main_image?.images || [])[0] ||
    alibabaProduct.thumbnail_url ||
    "https://placehold.co/300";

  // Use product_id (obfuscated string) as the ID for detail page navigation
  // so that alibaba.icbu.product.get can look it up correctly
  return {
    id:               alibabaProduct.product_id || String(alibabaProduct.id),
    name:             normalizeProductTitle(alibabaProduct.subject || alibabaProduct.title || "Unknown Product"),
    price:            usdPrice,
    selling_price_ghs: usdPrice * exchangeRate,
    image_url:        imageUrl,
    is_alibaba:       true, // Flag so frontend knows it's an API product
    pc_detail_url:    alibabaProduct.pc_detail_url || null,
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
        // alibaba.icbu.product.list — official ICBU product search API
        // Required params per docs: language (must be 'ENGLISH')
        // Optional: subject (fuzzy name search), current_page, page_size (max 30)
        const res = await alibabaRequest({
          apiMethod: 'alibaba.icbu.product.list',
          params: {
            subject:      params.query,
            language:     'ENGLISH',  // Required — only value supported per docs
            page_size:    20,
            current_page: 1,
          }
        });

        // Response shape (simplify=true): alibaba_icbu_product_list_response.products[]
        // Each product has: id, product_id, subject, main_image.images[], status, pc_detail_url
        const responseWrapper = res?.alibaba_icbu_product_list_response;
        const rawProducts: any[] = responseWrapper?.products || [];

        if (rawProducts.length > 0) {
          // Trust Filter & Scrubber
          const trusted = await filterTrustedProducts(rawProducts);
          const scrubbed = trusted.map(stripSupplierData);

          alibabaProducts = scrubbed.map((p: any) => mapAlibabaToC2g(p, exchangeRate));

          // Save to Cache (TTL 12 hours)
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 12);

          await supabase.from("search_query_cache").upsert({
            query_hash:  qHash,
            query_text:  params.query,
            result_data: scrubbed,
            expires_at:  expiresAt.toISOString()
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
    // alibaba.icbu.product.get — official ICBU product detail API
    // Required params per docs: language ('ENGLISH'), product_id (obfuscated string ID)
    const res = await alibabaRequest({
      apiMethod: 'alibaba.icbu.product.get',
      params: {
        language:   'ENGLISH',  // Required — only value supported per docs
        product_id: id,         // The obfuscated product_id string from search results
      }
    });

    // Response shape: alibaba_icbu_product_get_response.product
    const rawProduct = res?.alibaba_icbu_product_get_response?.product;
    if (!rawProduct) throw new Error("Product not found on Alibaba");

    // 1. Calculate Trust Score
    const trustEval = calculateTrustScore(rawProduct, []);
    if (!trustEval.passed) {
      throw new Error(`This product failed C2G's security and quality checks. (${trustEval.reasons.join(", ")})`);
    }

    // 2. Strip Supplier Info (White-labeling)
    const safeProduct = stripSupplierData(rawProduct);

    // 3. Map to C2G Frontend Structure
    // ICBU product.get response: main_image.images[], product_sku.skus[], wholesale_trade, sourcing_trade
    const rawImages = (safeProduct as any).main_image?.images;
    const mainImages: string[] = Array.isArray(rawImages) ? rawImages : [];

    // SKU variants from product_sku.skus[]
    // sku_attributes provides the lookup table: attribute_id -> attribute_name, value_id -> display_name
    const skuAttributeLookup: Record<string, { attrName: string; values: Record<string, string> }> = {};
    for (const attr of ((safeProduct as any).product_sku?.sku_attributes || [])) {
      const valMap: Record<string, string> = {};
      for (const v of (attr.values || [])) {
        valMap[String(v.value_id)] = v.custom_value_name || v.system_value_name || String(v.value_id);
      }
      skuAttributeLookup[String(attr.attribute_id)] = {
        attrName: attr.attribute_name || String(attr.attribute_id),
        values: valMap,
      };
    }

    const skuDefs = (safeProduct as any).product_sku?.skus || [];
    const variants = skuDefs.map((sku: any) => {
      // Price from bulk_discount_prices[0].price (USD) or product-level fallback
      const priceUsd = parseFloat(
        sku.bulk_discount_prices?.[0]?.price ||
        safeProduct.wholesale_trade?.price ||
        safeProduct.sourcing_trade?.fob_min_price ||
        '0'
      );

      // attr2_value is a map like "{11:12,22:21}" per docs (attribute_id:value_id pairs)
      // Cross-reference sku_attributes to build readable label e.g. "Color: Light Grey / Size: XL"
      let attrLabel = 'Standard';
      if (sku.attr2_value) {
        try {
          const pairs = String(sku.attr2_value).replace(/[{}]/g, '').split(',');
          const parts: string[] = [];
          for (const pair of pairs) {
            const parts2 = pair.split(':').map((s: string) => s.trim());
            const attrId = parts2[0];
            const valueId = parts2[1];
            if (!attrId || !valueId) continue;
            const attrDef = skuAttributeLookup[attrId];
            if (attrDef) {
              const valueName = attrDef.values[valueId] || valueId;
              parts.push(`${attrDef.attrName}: ${valueName}`);
            }
          }
          if (parts.length > 0) attrLabel = parts.join(' / ');
        } catch {
          attrLabel = String(sku.attr2_value);
        }
      }

      // Real inventory from inventory_dto_list (cn_inventory store)
      const inventoryEntry = (sku.inventory_dto_list || []).find(
        (inv: any) => inv.store_code === 'cn_inventory'
      );
      const stock = inventoryEntry?.inventory ?? 999;

      return {
        id: String(sku.sku_id || sku.sku_code || 'default'),
        combination: attrLabel,
        price: priceUsd,
        selling_price_ghs: priceUsd * exchangeRate,
        image_url: mainImages[0] || '',
        stock,
      };
    });


    // Fallback: if no SKUs, create one variant from wholesale/sourcing trade info
    if (variants.length === 0) {
      const priceUsd = parseFloat(
        safeProduct.wholesale_trade?.price ||
        safeProduct.sourcing_trade?.fob_min_price ||
        '0'
      );
      variants.push({
        id: 'default',
        combination: 'Standard',
        price: priceUsd,
        selling_price_ghs: priceUsd * exchangeRate,
        image_url: mainImages[0] || '',
        stock: 999
      });
    }

    const mappedProduct = {
      id:               safeProduct.product_id || id,
      name:             normalizeProductTitle(safeProduct.subject || 'Unknown Product'),
      description:      safeProduct.description || '',
      images:           mainImages,
      variants,
      category:         safeProduct.category_id,
      wholesale_volume: safeProduct.wholesale_trade?.volume,
      trustScore:       trustEval.score,
      trustBadges:      [] as string[],
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
