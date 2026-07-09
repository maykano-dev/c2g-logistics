"use server";

import { createClient } from "@/utils/supabase/server";
import { aliexpressRequest } from "@/lib/aliexpress/client";
import { normalizeProductTitle } from "@/lib/alibaba/text-cleaner";
import crypto from 'crypto';

// ═══════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════
async function getExchangeRate(supabase: any): Promise<{ cnyToGhs: number, usdToCny: number }> {
  let cnyToGhs = 0.52; // 1 GHS = 0.52 CNY
  const usdToCny = 7.25; // Approximate static rate for USD to CNY (AliExpress internal)

  const { data: settingsData } = await supabase
    .from("settings")
    .select("rate_shop_products")
    .eq("id", 1)
    .single();
  
  if (settingsData?.rate_shop_products) {
    cnyToGhs = parseFloat(settingsData.rate_shop_products);
  } else {
    const { data: sysData } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "exchange_rate_cny_ghs")
      .single();
    if (sysData?.value) {
      cnyToGhs = parseFloat(sysData.value);
    }
  }

  return { cnyToGhs, usdToCny };
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
function mapAliExpressToC2g(aeProduct: any, rates: { cnyToGhs: number, usdToCny: number }) {
  let usdPrice = parseFloat(
    aeProduct.targetSalePrice ||
    aeProduct.target_sale_price ||
    aeProduct.app_sale_price ||
    "0"
  );

  // Fallback: If targetSalePrice is completely missing, use salePrice but divide by CNY->USD rate (approx 7.2)
  if (usdPrice === 0) {
    const rawSalePrice = parseFloat(aeProduct.salePrice || "0");
    usdPrice = rawSalePrice / rates.usdToCny;
  }

  let imageUrl =
    aeProduct.itemMainPic ||
    aeProduct.product_main_image_url ||
    aeProduct.image_url ||
    "https://placehold.co/300";

  if (imageUrl && imageUrl.startsWith('//')) {
    imageUrl = 'https:' + imageUrl;
  }

  // Convert USD -> CNY -> GHS
  const cnyPrice = usdPrice * rates.usdToCny;
  const ghsPrice = cnyPrice / rates.cnyToGhs;

  return {
    id: String(aeProduct.id || aeProduct.itemId || aeProduct.product_id),
    name: normalizeProductTitle(aeProduct.name || aeProduct.title || aeProduct.product_title || "Unknown Product"),
    price: usdPrice,
    selling_price_ghs: ghsPrice,
    image_url: imageUrl,
    rating: aeProduct.score || aeProduct.evaluate_score || aeProduct.evaluate_rate || "0",
    orders: aeProduct.orders || aeProduct.lastest_volume || 0,
    is_aliexpress: true, // Flag so frontend knows it's an API product
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
    const rates = await getExchangeRate(supabase);
    
    return {
      success: true,
      products: data?.map((p) => {
        const cnyPrice = p.price_snapshot_usd * rates.usdToCny;
        const ghsPrice = cnyPrice / rates.cnyToGhs;
        return {
          id: p.id,
          name: p.title,
          price: p.price_snapshot_usd,
          selling_price_ghs: ghsPrice,
          image_url: p.thumbnail_url,
          demandLabel: p.purchase_count > 50 ? "high" : "medium"
        };
      }) || [],
      exchangeRate: rates.cnyToGhs
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
  imageId?: string;
}) {
  const supabase = await createClient();
  const rates = await getExchangeRate(supabase);
  const page = params?.page || 1;
  const limit = 20;

  // Intercept for Image Search
  if (params?.imageId) {
    const { data: cacheData } = await supabase
      .from("search_query_cache")
      .select("result_data")
      .eq("query_hash", params.imageId)
      .single();
      
    if (cacheData && cacheData.result_data?.items) {
       return {
         success: true,
         products: cacheData.result_data.items.map((p: any) => mapAliExpressToC2g(p, rates)),
         exchangeRate: rates.cnyToGhs,
         totalCount: cacheData.result_data.total || cacheData.result_data.items.length,
         totalPages: 1,
         currentPage: 1
       };
    }
  }

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

  // 2. If there is a search query or category, fetch from Alibaba (Level 2)
  const isSearchOrCategory = !!params?.query || (!!params?.category && params.category !== "all");

  if (isSearchOrCategory) {
    const qHash = hashQuery(`${params?.query || ''}_${params?.category || ''}_${page}`);
    
    // Check Search Query Cache first
    const { data: cacheData } = await supabase
      .from("search_query_cache")
      .select("result_data, expires_at")
      .eq("query_hash", qHash)
      .single();

    if (cacheData && new Date(cacheData.expires_at) > new Date()) {
      // CACHE HIT
      const parsedData = cacheData.result_data;
      alibabaProducts = parsedData.items.map((p: any) => mapAliExpressToC2g(p, exchangeRate));
      totalCount += parsedData.total || 0;
    } else {
      // CACHE MISS → Call AliExpress DS API
      try {
        const aeParams: any = {
          sort:          'default',
          pageNo:        String(page),
          page_no:       String(page),
          pageSize:      '20',
          page_size:     '20',
          currency:      'USD',
          local:         'en_US',
          countryCode:   'GH',
          shipToCountry: 'GH',
        };

        if (params?.query) {
          aeParams.keyWord = params.query;
          aeParams.search_text = params.query;
        }

        if (params?.category && params.category !== "all") {
          const isNumeric = /^\d+$/.test(params.category);
          if (isNumeric) {
            aeParams.categoryId = params.category;
            aeParams.category_id = params.category;
          } else {
            // If it's a string like "fashion", append it to the keyword search
            if (!aeParams.keyWord) {
              aeParams.keyWord = params.category;
              aeParams.search_text = params.category;
            } else {
              aeParams.keyWord = `${params.category} ${aeParams.keyWord}`;
              aeParams.search_text = aeParams.keyWord;
            }
          }
        }

        const res = await aliexpressRequest({
          apiMethod: 'aliexpress.ds.text.search',
          params: aeParams
        });

        const wrapper = res?.aliexpress_ds_text_search_response || res;
        let resultList: any[] = [];
        let aeTotal = 0;
        
        if (Array.isArray(wrapper?.data?.products?.selection_search_product)) {
          resultList = wrapper.data.products.selection_search_product;
          aeTotal = Number(wrapper.data.totalCount) || 0;
        } else if (Array.isArray(res?.data?.products?.selection_search_product)) {
           resultList = res.data.products.selection_search_product;
           aeTotal = Number(res.data.totalCount) || 0;
        } else if (Array.isArray(wrapper?.data?.products)) {
          resultList = wrapper.data.products;
          aeTotal = Number(wrapper.data.totalCount) || 0;
        }

        if (resultList.length > 0) {
          alibabaProducts = resultList.map((p: any) => mapAliExpressToC2g(p, exchangeRate));
          totalCount += aeTotal;

          // Save to Cache (TTL 12 hours)
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 12);

          await supabase.from("search_query_cache").upsert({
            query_hash:  qHash,
            query_text:  `${params?.query || ''}_${params?.category || ''}_${page}`,
            result_data: { items: resultList, total: aeTotal },
            expires_at:  expiresAt.toISOString()
          });
        }
      } catch (e) {
        console.error("AliExpress Search Failed, falling back to local only", e);
      }
    }
  } else if (!isSearchOrCategory && localProducts.length === 0) {
    // EMPTY SHOP FALLBACK: If local DB is empty and no query provided, fetch a generic popular category
    try {
      const res = await aliexpressRequest({
        apiMethod: 'aliexpress.ds.text.search',
        params: {
          keyWord:       'fashion',
          search_text:   'fashion',
          sort:          'default',
          pageNo:        String(page),
          page_no:       String(page),
          pageSize:      '20',
          page_size:     '20',
          currency:      'USD',
          local:         'en_US',
          countryCode:   'GH',
          shipToCountry: 'GH',
        }
      });

      const wrapper = res?.aliexpress_ds_text_search_response || res;
      let resultList: any[] = [];
      let aeTotal = 0;
      
      if (Array.isArray(wrapper?.data?.products?.selection_search_product)) {
        resultList = wrapper.data.products.selection_search_product;
        aeTotal = Number(wrapper.data.totalCount) || 0;
      } else if (Array.isArray(res?.data?.products?.selection_search_product)) {
        resultList = res.data.products.selection_search_product;
        aeTotal = Number(res.data.totalCount) || 0;
      } else if (Array.isArray(wrapper?.data?.products)) {
        resultList = wrapper.data.products;
        aeTotal = Number(wrapper.data.totalCount) || 0;
      }

      if (resultList.length > 0) {
        alibabaProducts = resultList.map((p: any) => mapAliExpressToC2g(p, exchangeRate));
        totalCount += aeTotal;
      }
    } catch (e) {
      console.error("AliExpress Default Fallback Search Failed", e);
    }
  }

  // Merge (Local first, then Alibaba)
  // Ensure no duplicates if a product was promoted to local DB but also returned in Alibaba search
  const localIds = new Set(localProducts.map(p => p.id));
  const uniqueAlibaba = alibabaProducts.filter(p => !localIds.has(p.id));
  
  const finalProducts = [...localProducts, ...uniqueAlibaba];

  return { 
    success: true, 
    products: finalProducts, 
    exchangeRate,
    totalCount: totalCount,
    totalPages: Math.ceil(totalCount / limit) || 1,
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
    const qHash = `product_detail_${id}`;
    
    // Check Cache First
    const { data: cacheData } = await supabase
      .from("search_query_cache")
      .select("result_data, expires_at")
      .eq("query_hash", qHash)
      .single();

    if (cacheData && new Date(cacheData.expires_at) > new Date()) {
      // Track View Count (For Auto-Promotion Engine) in background
      supabase.rpc('increment_view_count', { p_id: id }).catch(() => {});
      return { success: true, product: cacheData.result_data, exchangeRate };
    }

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
    let imageStr = raw.ae_multimedia_info_dto?.image_urls;
    let mainImages: string[] = [];
    const parseImage = (u: any) => {
       if (typeof u !== 'string') return null;
       if (u.startsWith('//')) return 'https:' + u;
       if (u.startsWith('http')) return u;
       return null;
    };
    if (typeof imageStr === 'string') {
        mainImages = imageStr.split(';').map(parseImage).filter(Boolean) as string[];
    } else if (imageStr && Array.isArray(imageStr.string)) {
        mainImages = imageStr.string.map(parseImage).filter(Boolean) as string[];
    }
    
    // Fallback if no images found
    if (mainImages.length === 0) {
      mainImages = [raw.ae_item_base_info_dto?.subject_trans, raw.ae_item_base_info_dto?.detail]
        .filter(Boolean)
        .filter((u: any) => typeof u === 'string' && u.startsWith('http'));
    }

    // SKU variants from ae_item_sku_info_dtos.ae_item_sku_info_d_t_o[]
    const skuDefs: any[] = raw.ae_item_sku_info_dtos?.ae_item_sku_info_d_t_o || [];
    const variants = skuDefs.map((sku: any) => {
      const priceUsd = parseFloat(
        sku.sku_price || sku.offer_sale_price || '0'
      );

      // ae_sku_property_dtos → readable combination label like "Color: Black / Size: XL"
      const propParts: string[] = (sku.ae_sku_property_dtos?.ae_sku_property_d_t_o || []).map(
        (prop: any) => {
          let val = prop.property_value_definition_name || prop.sku_property_value;
          // Simple Pinyin color translation
          const colorMap: Record<string, string> = {
            'heise': 'Black', 'baise': 'White', 'hongse': 'Red', 'lanse': 'Blue', 'lvse': 'Green',
            'huangse': 'Yellow', 'zise': 'Purple', 'fense': 'Pink', 'huise': 'Grey', 'zongse': 'Brown',
            'kafei': 'Coffee', 'chengse': 'Orange', 'jiuhong': 'Wine Red', 'baolan': 'Sapphire Blue',
            'kaki': 'Khaki', 'zangqing': 'Navy', 'mima': 'Beige'
          };
          const lowerVal = String(val).toLowerCase().trim();
          if (colorMap[lowerVal]) {
            val = colorMap[lowerVal];
          }
          return `${prop.sku_property_name}: ${val}`;
        }
      );
      const combination = propParts.length > 0 ? propParts.join(' / ') : 'Standard';

      let skuImageUrl = sku.sku_image || mainImages[0] || '';
      if (skuImageUrl.startsWith('//')) {
        skuImageUrl = 'https:' + skuImageUrl;
      }

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
    
    // Construct text specifications from item properties
    let specsHtml = "";
    if (Array.isArray(raw.ae_item_properties?.ae_item_property)) {
      specsHtml = `<ul class="c2g-specs">`;
      raw.ae_item_properties.ae_item_property.forEach((prop: any) => {
         if (prop.attr_name && prop.attr_value) {
            specsHtml += `<li><strong>${prop.attr_name}:</strong> ${prop.attr_value}</li>`;
         }
      });
      specsHtml += `</ul>`;
    }
    const finalDescription = specsHtml + (baseInfo.detail || '');

    const mappedProduct = {
      id:          String(baseInfo.product_id || id),
      name:        normalizeProductTitle(baseInfo.subject || baseInfo.title || 'Unknown Product'),
      description: finalDescription,
      images:      mainImages.length > 0 ? mainImages : ['https://placehold.co/600'],
      variants,
      category:    baseInfo.category_id,
      rating:      baseInfo.avg_evaluation_rating,
      orders:      baseInfo.lastest_volume,
      trustScore:  90, // AliExpress platform handles seller trust
      trustBadges: ['AliExpress Verified'] as string[],
    };

    // Save to Cache (24 hours TTL)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    await supabase.from("search_query_cache").upsert({
      query_hash:  `product_detail_${id}`,
      query_text:  `product_detail_fetch`,
      result_data: mappedProduct,
      expires_at:  expiresAt.toISOString()
    }).catch(e => console.error("Failed to cache product details", e));

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
// Visual Image Search (AliExpress Dropshipping API)
// ═══════════════════════════════════════════════════════════════════
export async function processImageSearch(base64Data: string) {
  const supabase = await createClient();
  // Strip the 'data:image/...;base64,' prefix if it exists
  const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, "");
  
  // Generate a hash ID for caching
  const crypto = require("crypto");
  const queryHash = crypto.createHash("md5").update(base64Clean).digest("hex");

  // Check if we already searched this exact image recently
  const { data: existingCache } = await supabase
    .from("search_query_cache")
    .select("query_hash")
    .eq("query_hash", queryHash)
    .single();

  if (existingCache) {
    return { success: true, searchId: queryHash };
  }

  try {
    const APP_KEY = process.env.ALIEXPRESS_APP_KEY || "538994";
    const APP_SECRET = process.env.ALIEXPRESS_APP_SECRET || "F6hz1FFs8FlXmEGuigr9r7HXMLQ5sRuQ";
    const SESSION = process.env.ALIEXPRESS_SESSION || "50000700a01Ok1c2f26cavAgAp0RvfZYo2FlTcTpEXBjTgMuzHokum4iRt3SHOds7YY2";
    const GATEWAY = "https://api-sg.aliexpress.com/sync";

    const params: any = {
      app_key: APP_KEY,
      session: SESSION,
      method: "aliexpress.ds.image.search",
      sign_method: "md5",
      timestamp: Date.now().toString(),
      shpt_to: "GH",
      target_currency: "USD",
      target_language: "EN",
      sort: "default"
    };

    const sortedKeys = Object.keys(params).sort();
    let signString = "";
    for (const key of sortedKeys) {
      if (params[key] !== "") signString += key + params[key];
    }
    const fullString = APP_SECRET + signString + APP_SECRET;
    const signature = crypto.createHash('md5').update(fullString, 'utf8').digest('hex').toUpperCase();
    params.sign = signature;

    const url = new URL(GATEWAY);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== "") url.searchParams.append(k, v as string);
    });

    const formData = new FormData();
    const buffer = Buffer.from(base64Clean, "base64");
    // Uploading as a generic jpeg Blob
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    formData.append("image_file_bytes", blob, "upload.jpg");

    const res = await fetch(url.toString(), {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    const products = data?.aliexpress_ds_image_search_response?.data?.products?.traffic_image_product_d_t_o || [];
    
    if (products.length > 0) {
      // Save raw products to Cache so getShopProducts can map them via mapAliExpressToC2g
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 12);

      await supabase.from("search_query_cache").upsert({
        query_hash:  queryHash,
        query_text:  `image_search_${queryHash}`,
        result_data: { items: products, total: products.length },
        expires_at:  expiresAt.toISOString()
      });

      return { success: true, searchId: queryHash };
    }

    return { success: false, error: "No products found for this image" };
  } catch (err: any) {
    console.error("processImageSearch failed", err);
    return { success: false, error: err.message };
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
