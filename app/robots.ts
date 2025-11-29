import type { MetadataRoute } from "next"
import { absoluteUrl, siteMetadata } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = absoluteUrl("/sitemap.xml")

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/admin/", "/payload", "/payload/"],
      },
    ],
    sitemap: [sitemapUrl],
    host: siteMetadata.url,
  }
}

