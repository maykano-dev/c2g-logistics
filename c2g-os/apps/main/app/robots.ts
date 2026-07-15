import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/admin/",
        "/agent/",
        "/staff/",
        "/employee/",
        "/api/",
        "/checkout/",
        "/payment-status/",
        "/cart/",
      ],
    },
    sitemap: "https://c2g-logistics.com/sitemap.xml",
  };
}
