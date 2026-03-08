import type { MetadataRoute } from "next"

const BASE_URL = "https://geruestbauer24.eu"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Ana arama motorları — tam erişim, sadece özel alanlar engellendi
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/firma/dashboard/",
          "/kunde/dashboard/",
          "/admin/",
          "/auth/",
          "/api/",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/firma/dashboard/",
          "/kunde/dashboard/",
          "/admin/",
          "/auth/",
          "/api/",
        ],
      },
      // AI eğitim botlarını engelle
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
      {
        userAgent: "anthropic-ai",
        disallow: ["/"],
      },
      {
        userAgent: "Claude-Web",
        disallow: ["/"],
      },
      {
        userAgent: "Google-Extended",
        disallow: ["/"],
      },
      // Diğer tüm botlar için varsayılan
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/firma/dashboard/",
          "/kunde/dashboard/",
          "/admin/",
          "/auth/",
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}