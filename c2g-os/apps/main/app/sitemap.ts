import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://c2g-logistics.com";

  // Static public routes
  const routes = [
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
    priority: route === "" ? 1 : 0.8,
  }));

  return [...routes];
}
