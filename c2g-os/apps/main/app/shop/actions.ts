"use server";

import { createClient } from "@/utils/supabase/server";

// ═══════════════════════════════════════════════════════════════════
// Algorithm Constants
// ═══════════════════════════════════════════════════════════════════
const TREND_WEIGHT_ORDERS = 5;
const TREND_WEIGHT_CART = 3;
const TREND_WEIGHT_VIEWS = 1;

const DEMAND_HIGH_THRESHOLD = 50;
const DEMAND_MEDIUM_THRESHOLD = 15;

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
  return 0.52;
}

function computeTrendScore(p: any): number {
  return (
    (p.sales_count || 0) * TREND_WEIGHT_ORDERS +
    (p.cart_adds || 0) * TREND_WEIGHT_CART +
    (p.view_count || 0) * TREND_WEIGHT_VIEWS
  );
}

function computeDemandLabel(p: any): string {
  const score = (p.sales_count || 0) + (p.view_count || 0) * 0.1;
  if (score >= DEMAND_HIGH_THRESHOLD) return "high";
  if (score >= DEMAND_MEDIUM_THRESHOLD) return "medium";
  return "low";
}

// Safe product select — avoids columns that may not exist yet
const PRODUCT_SELECT = `
  *,
  product_images (
    id,
    image_url,
    is_primary,
    media_type
  )
`;

const PRODUCT_WITH_VARIANTS_SELECT = `
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
    variant_options,
    price,
    price_cny,
    cost_price_cny,
    selling_price_ghs,
    image_url,
    stock
  )
`;

// ═══════════════════════════════════════════════════════════════════
// Top Purchased Products (For Hero Carousel)
// ═══════════════════════════════════════════════════════════════════
export async function getTopPurchasedProducts(limit: number = 5) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_WITH_VARIANTS_SELECT)
      .in("status", ["published", "active"])
      .order("sales_count", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const exchangeRate = await getExchangeRate(supabase);
    
    return {
      success: true,
      products: data?.map((p) => ({
        ...p,
        demandLabel: computeDemandLabel(p),
      })) || [],
      exchangeRate
    };
  } catch (error: any) {
    console.error("Failed to fetch top purchased products:", error);
    return { success: false, products: [], exchangeRate: 1, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════════
// Main Products Query (with category + search + semantic search)
// ═══════════════════════════════════════════════════════════════════
export async function getShopProducts(params?: {
  category?: string;
  query?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: number;
}) {
  const supabase = await createClient();

  // Use status='published' instead of is_active=true (matches actual DB schema)
  let query = supabase.from("products").select(PRODUCT_WITH_VARIANTS_SELECT, { count: 'exact' });

  // Filter only published products
  query = query.in("status", ["published", "active"]);

  if (params?.category && params.category !== "all") {
    const cleanCategory = params.category.replace(/[^a-zA-Z0-9\s-&]/g, '');
    query = query.ilike("category", `%${cleanCategory}%`);
  }

  if (params?.minPrice) {
    query = query.gte("price", parseFloat(params.minPrice));
  }

  if (params?.maxPrice) {
    query = query.lte("price", parseFloat(params.maxPrice));
  }

  if (params?.query) {
    // Multi-field semantic search: search name, category, sku
    const cleanQuery = params.query.replace(/[^a-zA-Z0-9\s-]/g, '');
    query = query.or(
      `name.ilike.%${cleanQuery}%,category.ilike.%${cleanQuery}%,sku.ilike.%${cleanQuery}%`
    );
  }

  // Sorting
  const sort = params?.sort || "newest";
  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "popular":
      query = query.order("sales_count", { ascending: false });
      break;
    case "trending":
      query = query.order("view_count", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  // Pagination
  const page = params?.page || 1;
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: error.message };
  }

  const exchangeRate = await getExchangeRate(supabase);

  // Enrich products with computed scores
  const enrichedProducts = (data || []).map((p) => ({
    ...p,
    trendScore: computeTrendScore(p),
    demandLabel: computeDemandLabel(p),
  }));

  return { 
    success: true, 
    products: enrichedProducts, 
    exchangeRate,
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    currentPage: page
  };
}

// ═══════════════════════════════════════════════════════════════════
// Trending Products — sorted by trend score
// ═══════════════════════════════════════════════════════════════════
export async function getTrendingProducts() {
  const supabase = await createClient();
  const exchangeRate = await getExchangeRate(supabase);

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_VARIANTS_SELECT)
    .in("status", ["published", "active"])
    .order("view_count", { ascending: false })
    .limit(20);

  if (error) return { products: [], exchangeRate };

  // Sort by computed trend score
  const sorted = (data || [])
    .map((p) => ({ ...p, trendScore: computeTrendScore(p), demandLabel: computeDemandLabel(p) }))
    .sort((a, b) => b.trendScore - a.trendScore);

  return { products: sorted, exchangeRate };
}

// ═══════════════════════════════════════════════════════════════════
// New Arrivals
// ═══════════════════════════════════════════════════════════════════
export async function getNewArrivals() {
  const supabase = await createClient();
  const exchangeRate = await getExchangeRate(supabase);

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_VARIANTS_SELECT)
    .in("status", ["published", "active"])
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) return { products: [], exchangeRate };

  const enriched = (data || []).map((p) => ({
    ...p,
    trendScore: computeTrendScore(p),
    demandLabel: computeDemandLabel(p),
  }));

  return { products: enriched, exchangeRate };
}

// ═══════════════════════════════════════════════════════════════════
// Best Sellers
// ═══════════════════════════════════════════════════════════════════
export async function getBestSellers() {
  const supabase = await createClient();
  const exchangeRate = await getExchangeRate(supabase);

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_VARIANTS_SELECT)
    .in("status", ["published", "active"])
    .order("sales_count", { ascending: false })
    .limit(15);

  if (error) return { products: [], exchangeRate };

  const enriched = (data || []).map((p) => ({
    ...p,
    trendScore: computeTrendScore(p),
    demandLabel: computeDemandLabel(p),
  }));

  return { products: enriched, exchangeRate };
}

// ═══════════════════════════════════════════════════════════════════
// Product Details (with variants — for PDP)
// ═══════════════════════════════════════════════════════════════════
export async function getProductDetails(id: string) {
  const supabase = await createClient();

  // Try with variants first. If combination column doesn't exist, fallback.
  let productData = null;
  let productError = null;

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_VARIANTS_SELECT)
    .eq("id", id)
    .single();

  if (error && error.code === "42703") {
    // Column doesn't exist — try without combination
    const { data: fallback, error: fallbackError } = await supabase
      .from("products")
      .select(
        `*, product_images (id, image_url, is_primary, media_type), product_variants (id, sku, price, price_cny, stock)`
      )
      .eq("id", id)
      .single();
    productData = fallback;
    productError = fallbackError;
  } else {
    productData = data;
    productError = error;
  }

  if (productError) {
    console.error("Error fetching product details:", productError);
    return { success: false, error: productError.message };
  }

  const exchangeRate = await getExchangeRate(supabase);

  // Safely fetch reviews if the table exists
  let reviews: any[] = [];
  try {
    const { data: revData } = await supabase
      .from("product_reviews")
      .select("rating, review_text, created_at, user_id")
      .eq("product_id", id);
    if (revData) reviews = revData;
  } catch (_) {}

  productData.reviews = reviews;


  // Increment view count (fire and forget)
  supabase
    .from("products")
    .update({ view_count: (productData?.view_count || 0) + 1 })
    .eq("id", id)
    .then(() => {});

  return { success: true, product: productData, exchangeRate };
}

// ═══════════════════════════════════════════════════════════════════
// Similar Products Engine
// Same category + same tags + same importer
// ═══════════════════════════════════════════════════════════════════
export async function getSimilarProducts(
  productId: string,
  category?: string
) {
  const supabase = await createClient();
  const exchangeRate = await getExchangeRate(supabase);

  if (!category) return { products: [], exchangeRate };

  const cleanCategory = category.replace(/[^a-zA-Z0-9\s-&]/g, '');

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .in("status", ["published", "active"])
    .ilike("category", `%${cleanCategory}%`)
    .neq("id", productId)
    .limit(8);

  if (error) return { products: [], exchangeRate };

  const enriched = (data || []).map((p) => ({
    ...p,
    trendScore: computeTrendScore(p),
    demandLabel: computeDemandLabel(p),
  }));

  return { products: enriched, exchangeRate };
}

// ═══════════════════════════════════════════════════════════════════
// Categories — pull unique categories from DB
// ═══════════════════════════════════════════════════════════════════
export async function getCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("category")
    .in("status", ["published", "active"])
    .not("category", "is", null);

  if (error) return [];

  // Extract unique categories
  const cats = new Set<string>();
  (data || []).forEach((p: any) => {
    if (p.category) cats.add(p.category.toLowerCase().trim());
  });

  return Array.from(cats).sort();
}

// ═══════════════════════════════════════════════════════════════════
// Smart Shipping Recommendation
// ═══════════════════════════════════════════════════════════════════
export async function getShippingRecommendation(weightKg?: number, volumeCbm?: number) {
  if (weightKg && weightKg < 5) {
    return { mode: "air", label: "Air Freight Recommended", reason: "Light item under 5kg" };
  }
  if (volumeCbm && volumeCbm > 0.5) {
    return { mode: "sea", label: "Sea Freight Recommended", reason: "Bulky item over 0.5 CBM" };
  }
  return { mode: "air", label: "Air Freight Recommended", reason: "Default recommendation" };
}
