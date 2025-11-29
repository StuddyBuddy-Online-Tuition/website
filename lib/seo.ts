const fallbackSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.studybuddysynergy.com").replace(/\/$/, "")

export const siteMetadata = {
  name: "StudyBuddy Tutors",
  description:
    "Personalized online and hybrid tutoring for Malaysian primary and secondary students, delivered by vetted teachers across STEM and language subjects.",
  url: fallbackSiteUrl,
  locale: "en-MY",
  logoPath: "/logo.png",
  contactEmail: "admin@studybuddysynergy.com",
  contactPhone: "+60124997926",
  social: {
    facebook: "https://www.facebook.com/studybuddysynergy/",
  },
  keywords: [
    "StudyBuddy Tutors",
    "StudyBuddy Synergy",
    "online tutoring Malaysia",
    "tuition classes Malaysia",
    "SPM tutoring",
    "PT3 tutoring",
    "STEM tuition",
    "Bahasa Malaysia tutoring",
    "private tutor Malaysia",
    "hybrid tutoring",
  ],
}

export function absoluteUrl(path = "/"): string {
  if (!path) {
    return siteMetadata.url
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${siteMetadata.url}${normalizedPath}`
}

export function createMetadataBase(): URL {
  return new URL(siteMetadata.url)
}

export function resolveImageUrl(imageUrl?: string | null): string | undefined {
  if (!imageUrl) {
    return undefined
  }

  return absoluteUrl(imageUrl)
}

