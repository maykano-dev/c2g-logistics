"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAnonClient } from "@supabase/supabase-js";
import { searchProducts, getProductDetail, searchProductsByImage } from "@/lib/hiobuy";
import type { ProductChannel } from "@/lib/hiobuy";
import { normalizeProductTitle } from "@/lib/alibaba/text-cleaner";
import crypto from 'crypto';
import { unstable_cache } from 'next/cache';

// ═══════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════
async function getPricingConfig(supabase: any): Promise<{ rate: number, markup: number }> {
  // Fetch exchange_rate_ghs_to_cny and markup_percentage from settings
  const { data: settingsData } = await supabase
    .from("settings")
    .select("exchange_rate_ghs_to_cny, markup_percentage")
    .eq("id", 1)
    .single();
    
  return {
    rate: settingsData?.exchange_rate_ghs_to_cny || 0.52,
    markup: settingsData?.markup_percentage || 5
  };
}

// Helper to hash query strings for caching
function hashQuery(query: string): string {
  return crypto.createHash('sha256').update(query.trim().toLowerCase()).digest('hex');
}

function deduplicateProducts(products: any[]) {
  const seen = new Set();
  return products.filter(p => {
    const idStr = String(p.id);
    if (seen.has(idStr)) return false;
    seen.add(idStr);
    return true;
  });
}

function mapHiobuyToC2g(hbProduct: any, pricing: { rate: number, markup: number }) {
  const cnyPrice = hbProduct.price?.display_amount || hbProduct.price?.original_amount || 0;
  
  // Math Step 1: Exact Price (GHS) = HioBuy Price (CNY) / exchange_rate_ghs_to_cny
  const exactPriceGhs = cnyPrice / pricing.rate;
  
  // Math Step 2: True Display Price (GHS) = exactPrice + markup
  const sellingPriceGhs = exactPriceGhs + (exactPriceGhs * (pricing.markup / 100));
  
  // Approximate USD for internal tracking only
  const usdPrice = cnyPrice / 7.2;

  let imageUrl = hbProduct.image || hbProduct.images?.[0]?.url || "https://placehold.co/300";
  if (imageUrl.startsWith('//')) {
    imageUrl = 'https:' + imageUrl;
  }
  
  // Fallback for non-resolving mock test images or invalid relative URLs
  if (imageUrl.includes('cdn.hiobuy.com/mock') || (!imageUrl.startsWith('http') && !imageUrl.startsWith('/'))) {
    imageUrl = "https://placehold.co/600x600/1e293b/94a3b8?text=Mock+Product";
  }

  return {
    id:                String(hbProduct.id || hbProduct.source_product_id),
    name:              normalizeProductTitle(typeof hbProduct.title === 'string' ? hbProduct.title : (hbProduct.title?.translated || hbProduct.title?.original || "Unknown Product")),
    price:             usdPrice,
    selling_price_ghs: sellingPriceGhs,
    image_url:         imageUrl,
    rating:            "5.0",
    orders:            hbProduct.sales_count || hbProduct.orders || 0,
    is_aliexpress:     false,
    channel:           hbProduct.channel || "1688",
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
    const pricing = await getPricingConfig(supabase);
    
    const mapped = data?.map((p) => {
        const cnyPrice = p.price_snapshot_usd * 7.2;
        const exactPrice = cnyPrice / pricing.rate;
        return {
          id: String(p.id),
          name: p.title,
          price: p.price_snapshot_usd,
          selling_price_ghs: exactPrice + (exactPrice * (pricing.markup / 100)),
          image_url: p.thumbnail_url,
          demandLabel: p.purchase_count > 50 ? "high" : "medium"
        };
      }) || [];
      
    return {
      success: true,
      products: deduplicateProducts(mapped),
      exchangeRate: pricing.rate // Returning rate for fallback UI compat
    };
  } catch (error: any) {
    console.error("Failed to fetch top purchased products:", error);
    return { success: false, products: [], exchangeRate: 1, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════════
// Level 2: Main Search (Hybrid Smart Gateway)
// ═══════════════════════════════════════════════════════════════════
async function fetchShopProductsBase(params?: {
  category?: string;
  query?: string;
  page?: number;
  imageId?: string;
  minPrice?: string;
  maxPrice?: string;
}) {
  const supabase = createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const pricing = await getPricingConfig(supabase);
  const page = params?.page || 1;
  const limit = 21;

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
         products: cacheData.result_data.items.map((p: any) => mapHiobuyToC2g(p, pricing)),
         exchangeRate: pricing.rate,
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
  
  let cnyMinPrice: number | undefined;
  let cnyMaxPrice: number | undefined;

  if (params?.minPrice) {
    cnyMinPrice = (Number(params.minPrice) / (1 + pricing.markup / 100)) * pricing.rate;
    const usdMinPrice = cnyMinPrice / 7.2;
    localQuery = localQuery.gte("price_snapshot_usd", usdMinPrice);
  }
  if (params?.maxPrice) {
    cnyMaxPrice = (Number(params.maxPrice) / (1 + pricing.markup / 100)) * pricing.rate;
    const usdMaxPrice = cnyMaxPrice / 7.2;
    localQuery = localQuery.lte("price_snapshot_usd", usdMaxPrice);
  }
  
  const from = (page - 1) * limit;
  const { data: localData, count } = await localQuery.range(from, from + limit - 1).order("c2g_trust_score", { ascending: false });
  totalCount += (count || 0);

  localProducts = (localData || []).map((p) => {
    let img = p.thumbnail_url || 'https://placehold.co/300';
    if (img.startsWith('//')) img = 'https:' + img;
    else if (!img.startsWith('http')) img = 'https://placehold.co/300';

    const cnyPrice = p.price_snapshot_usd * 7.2;
    const exactPrice = cnyPrice / pricing.rate;

    return {
      id: p.id,
      name: p.title,
      price: p.price_snapshot_usd,
      selling_price_ghs: exactPrice + (exactPrice * (pricing.markup / 100)),
      image_url: img,
    };
  });

  // 2. We ALWAYS fetch from HioBuy to fill out the shop. 
  // If no search or category, we use a rotating keyword based on the page number to populate the generic shop page with a mixture of categories.
  let searchQuery = params?.query || '';
  const searchCategory = params?.category === 'all' ? '' : (params?.category || '');

  let isHeterogeneousHomepage = false;
  let homepageKeywords: string[] = [];

  if (!searchQuery && !searchCategory) {
    isHeterogeneousHomepage = true;
    const mixKeywords = [
      'shoes', 'decor', 'sneakers', 'smartwatch', 'kitchenware', 'dresses', 
      'earbuds', 'fitness', 'stationery', 'toys', 'sunglasses', 'backpack', 
      'jewelry', 'makeup', 'gaming', 'accessories', 'outdoor', 'pets', 'vintage', 
      'streetwear', 'tools', 'party', 'handbags'
    ];
    // Pick 4 completely random keywords to fetch for a heterogeneous mix
    const shuffled = [...mixKeywords].sort(() => 0.5 - Math.random());
    homepageKeywords = shuffled.slice(0, 4);
    searchQuery = 'homepage_mixed';
  }
  
  const qHash = hashQuery(`${searchQuery}_${searchCategory}_${page}_${params?.minPrice || ''}_${params?.maxPrice || ''}`);
  
  // Check Search Query Cache first
  const { data: cacheData } = await supabase
    .from("search_query_cache")
    .select("result_data, expires_at")
    .eq("query_hash", qHash)
    .single();

  if (cacheData && new Date(cacheData.expires_at) > new Date()) {
    // CACHE HIT
    const parsedData = cacheData.result_data;
    alibabaProducts = parsedData.items.map((p: any) => mapHiobuyToC2g(p, pricing));
    totalCount += parsedData.total || 0;
  } else {
    // CACHE MISS → Call HioBuy API
    try {
      if (isHeterogeneousHomepage) {
        // Fetch 4 different keywords simultaneously, 5 items each
        const searchPromises = homepageKeywords.map(kw => 
          searchProducts({
            channel: "1688",
            keyword: kw,
            page: page,
            page_size: 6,
            price_start: cnyMinPrice,
            price_end: cnyMaxPrice
          }).catch(e => { console.warn('HioBuy multi-search error:', e); return null; })
        );

        const results = await Promise.all(searchPromises);
        let combinedItems: any[] = [];
        let combinedTotal = 0;
        
        results.forEach(res => {
          if (res && res.items) {
            combinedItems = [...combinedItems, ...res.items];
            combinedTotal += (res.total || res.items.length);
          }
        });

        // Deduplicate items by ID to prevent React key collisions
        const seenIds = new Set();
        const deduplicatedItems: any[] = [];
        
        for (const item of combinedItems) {
          const id = item.id || item.num_iid;
          if (!seenIds.has(id)) {
            seenIds.add(id);
            deduplicatedItems.push(item);
          }
        }

        // Interleave/shuffle the combined items so they are truly mixed
        deduplicatedItems.sort(() => 0.5 - Math.random());

        if (deduplicatedItems.length > 0) {
          alibabaProducts = deduplicatedItems.map((p: any) => mapHiobuyToC2g(p, pricing));
          totalCount += combinedTotal;

          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 12);

          await supabase.from("search_query_cache").upsert({
            query_hash:  qHash,
            query_text:  `${searchQuery}_${searchCategory}_${page}_${params?.minPrice || ''}_${params?.maxPrice || ''}`,
            result_data: { items: combinedItems, total: combinedTotal },
            expires_at:  expiresAt.toISOString()
          });
        }
      } else {
        // Specific Keyword Search
        let finalKeyword = searchQuery;
        if (searchCategory) {
          const isNumeric = /^\d+$/.test(searchCategory);
          if (!isNumeric) {
             finalKeyword = finalKeyword ? `${searchCategory} ${finalKeyword}` : searchCategory;
          }
        }
        
        const res = await searchProducts({
          channel: "1688", // Default to 1688 for generic shop search
          keyword: finalKeyword || "trending",
          page: page,
          page_size: limit,
          price_start: cnyMinPrice,
          price_end: cnyMaxPrice
        });

        if (res && res.items && res.items.length > 0) {
          alibabaProducts = res.items.map((p: any) => mapHiobuyToC2g(p, pricing));
          totalCount += res.total || res.items.length;

          // Save to Cache (TTL 12 hours)
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 12);

          await supabase.from("search_query_cache").upsert({
            query_hash:  qHash,
            query_text:  `${searchQuery}_${searchCategory}_${page}_${params?.minPrice || ''}_${params?.maxPrice || ''}`,
            result_data: { items: res.items, total: res.total || res.items.length },
            expires_at:  expiresAt.toISOString()
          });
        }
      }
    } catch (e) {
      console.error("HioBuy Search Failed", e);
    }
  }

  // Merge (Local first, then Alibaba)
  // Ensure no duplicates if a product was promoted to local DB but also returned in Alibaba search,
  // and ensure no internal duplicates from cached Alibaba results.
  const localIds = new Set(localProducts.map(p => String(p.id)));
  const uniqueAlibaba: any[] = [];
  const seenAlibabaIds = new Set();
  
  for (const p of alibabaProducts) {
    const idStr = String(p.id);
    if (!localIds.has(idStr) && !seenAlibabaIds.has(idStr)) {
      seenAlibabaIds.add(idStr);
      uniqueAlibaba.push(p);
    }
  }
  
  const finalProducts = [...localProducts, ...uniqueAlibaba].slice(0, limit);

  return { 
    success: true, 
    products: finalProducts, 
    exchangeRate: pricing.rate,
    totalCount: totalCount,
    totalPages: Math.ceil(totalCount / limit) || 1,
    currentPage: page
  };
}

const getCachedShopProducts = unstable_cache(
  async (category: string, query: string, page: number, imageId: string, minPrice: string, maxPrice: string) => {
    return fetchShopProductsBase({
      category: category !== 'all' ? category : undefined,
      query: query !== 'none' ? query : undefined,
      page,
      imageId: imageId !== 'none' ? imageId : undefined,
      minPrice: minPrice !== 'none' ? minPrice : undefined,
      maxPrice: maxPrice !== 'none' ? maxPrice : undefined
    });
  },
  ['shop-products-search'],
  { revalidate: 900 }
);

export const getShopProducts = async (params?: {
  category?: string;
  query?: string;
  page?: number;
  imageId?: string;
  minPrice?: string;
  maxPrice?: string;
}) => {
  return getCachedShopProducts(
    params?.category || 'all',
    params?.query || 'none',
    params?.page || 1,
    params?.imageId || 'none',
    params?.minPrice || 'none',
    params?.maxPrice || 'none'
  );
};

// ═══════════════════════════════════════════════════════════════════
// Live Product Details (HioBuy API)
// ═══════════════════════════════════════════════════════════════════
export async function getProductDetails(id: string) {
  const supabase = await createClient();
  const pricing = await getPricingConfig(supabase);

  try {
    const qHash = `product_detail_${id}_v2`;
    
    // Check Cache First
    const { data: cacheData } = await supabase
      .from("search_query_cache")
      .select("result_data, expires_at")
      .eq("query_hash", qHash)
      .single();

    if (cacheData && new Date(cacheData.expires_at) > new Date()) {
      // Track View Count (For Auto-Promotion Engine) in background
      supabase.rpc('increment_view_count', { p_id: id }).then(null, () => {});
      return { success: true, product: cacheData.result_data, exchangeRate: pricing.rate };
    }

    // CACHE MISS → Call HioBuy API
    // We try 1688 first, but in a real scenario we'd know the channel from the ID
    const res = await getProductDetail({
      channel: "1688",
      id: id,
    }).catch(() => getProductDetail({ channel: "taobao", id })); // fallback to taobao if 1688 fails

    const raw = res?.product;
    if (!raw) throw new Error("Product not found on HioBuy");

    let mainImages = raw.images?.map(i => i.url) || [];
    if (mainImages.length === 0) {
      mainImages.push('https://placehold.co/600');
    }
    mainImages = mainImages.map(img => {
      if (img.includes('cdn.hiobuy.com/mock')) return "https://placehold.co/600x600/1e293b/94a3b8?text=Mock+Product";
      if (img.startsWith('//')) return 'https:' + img;
      return img;
    });

    const variants = (raw.variants || []).map((sku: any) => {
      const cnyPrice = sku.price?.display_amount || raw.price?.display_amount || 0;
      
      const exactPriceGhs = cnyPrice / pricing.rate;
      const sellingPriceGhs = exactPriceGhs + (exactPriceGhs * (pricing.markup / 100));
      const usdPrice = cnyPrice / 7.2;

      const propParts = (sku.attributes || []).map((attr: any) => `${attr.name}: ${attr.value}`);
      const combination = propParts.length > 0 ? propParts.join(' / ') : 'Standard';

      let variantImage = sku.image || mainImages[0] || '';
      if (variantImage.includes('cdn.hiobuy.com/mock')) variantImage = "https://placehold.co/600x600/1e293b/94a3b8?text=Mock+Product";

      return {
        id:                String(sku.sku_id || 'default'),
        sku_attr:          sku.sku_id,
        combination,
        price:             usdPrice,
        selling_price_ghs: sellingPriceGhs,
        image_url:         variantImage,
        stock:             sku.stock ?? 999,
        min_order_quantity: sku.min_order_quantity || raw.min_order_quantity || 1,
      };
    });

    if (variants.length === 0) {
      const cnyPrice = raw.price?.display_amount || 0;
      const exactPriceGhs = cnyPrice / pricing.rate;
      const sellingPriceGhs = exactPriceGhs + (exactPriceGhs * (pricing.markup / 100));
      const usdPrice = cnyPrice / 7.2;

      variants.push({
        id:                'default',
        sku_attr:          undefined,
        combination:       'Standard',
        price:             usdPrice,
        selling_price_ghs: sellingPriceGhs,
        image_url:         mainImages[0] || '',
        stock:             999,
        min_order_quantity: raw.min_order_quantity || 1,
      });
    }
    
    // Construct text specifications from item properties
    let specsHtml = "";
    if (raw.attributes && raw.attributes.length > 0) {
      specsHtml = `<ul class="c2g-specs">`;
      raw.attributes.forEach((prop: any) => {
         specsHtml += `<li><strong>${prop.name}:</strong> ${prop.value}</li>`;
      });
      specsHtml += `</ul>`;
    }
    const finalDescription = specsHtml + (raw.description?.translated || raw.description?.original || '');

    const mappedProduct = {
      id:          String(raw.id || id),
      name:        normalizeProductTitle(typeof raw.title === 'string' ? raw.title : (raw.title?.translated || raw.title?.original || 'Unknown Product')),
      description: finalDescription,
      images:      mainImages,
      variants,
      category:    "General",
      rating:      "5.0",
      orders:      0,
      channel:     raw.channel || "1688",
      min_order_quantity: raw.min_order_quantity || 1,
    };

    // Save to Cache (24 hours TTL)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    await supabase.from("search_query_cache").upsert({
      query_hash:  `product_detail_${id}_v2`,
      query_text:  `product_detail_fetch`,
      result_data: mappedProduct,
      expires_at:  expiresAt.toISOString()
    }).then(null, (e: any) => console.error("Failed to cache product details", e));

    // Track View Count (For Auto-Promotion Engine)
    try {
      await supabase.rpc('increment_view_count', { p_id: id });
    } catch (e) {
      // Ignore
    }

    return { success: true, product: mappedProduct, exchangeRate: pricing.rate };

  } catch (error: any) {
    console.error("Error fetching HioBuy product details:", error);
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════════
// Visual Image Search (HioBuy API)
// ═══════════════════════════════════════════════════════════════════
export async function processImageSearch(base64Data: string) {
  const supabase = await createClient();
  // Strip the 'data:image/...;base64,' prefix if it exists
  const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, "");
  
  // Generate a hash ID for caching
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
    const res = await searchProductsByImage({
      channel: "1688",
      image_base64: base64Clean,
      page: 1,
      page_size: 20
    });

    const products = res?.items || [];
    
    if (products.length > 0) {
      // Save raw products to Cache so getShopProducts can map them via mapHiobuyToC2g
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 12);

      await supabase.from("search_query_cache").upsert({
        query_hash:  queryHash,
        query_text:  `image_search_${queryHash}`,
        result_data: { items: products, total: res.total || products.length },
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
  const pricing = await getPricingConfig(supabase);

  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(12);

  const products = (data || []).map(p => {
    const cnyPrice = p.price_snapshot_usd * 7.2;
    const exactPrice = cnyPrice / pricing.rate;
    return {
      id: String(p.id),
      name: p.title,
      price: p.price_snapshot_usd,
      selling_price_ghs: exactPrice + (exactPrice * (pricing.markup / 100)),
      image_url: p.thumbnail_url
    };
  });

  return { products: deduplicateProducts(products), exchangeRate: pricing.rate };
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
    const filtered = res.products.filter((p: any) => String(p.id) !== productId);
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
  const pricing = await getPricingConfig(supabase);

  const items = data.map((row: any) => {
    const p = row.products;
    if (!p) return null;
    
    const cnyPrice = p.price_snapshot_usd * 7.2;
    const exactPrice = cnyPrice / pricing.rate;
    const sellingPriceGhs = exactPrice + (exactPrice * (pricing.markup / 100));

    return {
      id: String(p.id),
      name: p.title,
      imageUrl: p.thumbnail_url,
      priceGhs: sellingPriceGhs,
      priceCny: cnyPrice 
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
