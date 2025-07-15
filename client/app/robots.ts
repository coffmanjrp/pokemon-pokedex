import { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/utils/metadata";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/static/",
          "*.json",
          "/sandbox", // Exclude sandbox pages from search results
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
