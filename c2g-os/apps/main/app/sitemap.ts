import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://c2g-logistics.com";

  // Static public routes
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/shop",
    "/get-quote",
    "/privacy-policy",
    "/terms-and-conditions",
    "/shipping-policy",
    "/refund-policy",
    "/login",
    "/signup",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : route === "/shop" ? 0.9 : 0.8,
  }));

  // Dynamic product pages from the catalog
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: products } = await supabase
      .from("products")
      .select("product_id, updated_at")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1000);

    if (products && products.length > 0) {
      productRoutes = products.map((p) => ({
        url: `${baseUrl}/shop/product/${p.product_id}`,
        lastModified: p.updated_at || new Date().toISOString(),
        changeFrequency: "daily" as const,
        priority: 0.7,
      }));
    }
  } catch (e) {
    // If DB query fails, just return static routes
    console.warn("[Sitemap] Failed to fetch product routes:", e);
  }

  return [...staticRoutes, ...productRoutes];
}
