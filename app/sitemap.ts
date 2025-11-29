import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/register", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/timetable", priority: 0.8, changeFrequency: "daily" as const },
  ]

  const lastModified = new Date()

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified,
    priority,
    changeFrequency,
  }))
}

