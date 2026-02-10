import type { MetadataRoute } from "next"

const BASE_URL = "https://geruestbauer24.eu"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
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
