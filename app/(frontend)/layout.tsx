import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getFooterContent } from "@/lib/footer"
import { absoluteUrl, createMetadataBase, siteMetadata } from "@/lib/seo"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: createMetadataBase(),
  title: {
    default: siteMetadata.name,
    template: `%s | ${siteMetadata.name}`,
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  icons: {
    icon: siteMetadata.logoPath,
    shortcut: siteMetadata.logoPath,
    apple: siteMetadata.logoPath,
  },
  openGraph: {
    type: "website",
    url: siteMetadata.url,
    siteName: siteMetadata.name,
    title: siteMetadata.name,
    description: siteMetadata.description,
    locale: siteMetadata.locale,
    images: [
      {
        url: absoluteUrl(siteMetadata.logoPath),
        width: 512,
        height: 512,
        alt: `${siteMetadata.name} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.name,
    description: siteMetadata.description,
    images: [absoluteUrl(siteMetadata.logoPath)],
  },
  alternates: {
    canonical: siteMetadata.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const footer = await getFooterContent()
  const brandName = footer?.brandName || siteMetadata.name
  const description =
    footer?.description ||
    "StudyBuddy is your go-to online tutoring platform. Connect with expert tutors who care about your academic growth."
  const phone = footer?.links?.phone || siteMetadata.contactPhone
  const email = footer?.links?.email || siteMetadata.contactEmail
  const facebookUrl = footer?.links?.facebookUrl || siteMetadata.social.facebook

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${siteMetadata.url}/#organization`,
        name: brandName,
        url: siteMetadata.url,
        description,
        logo: absoluteUrl(siteMetadata.logoPath),
        email,
        telephone: phone,
        sameAs: facebookUrl ? [facebookUrl] : [],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: phone,
            contactType: "customer service",
            areaServed: "MY",
            availableLanguage: ["en", "ms"],
            email,
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteMetadata.url}/#website`,
        url: siteMetadata.url,
        name: siteMetadata.name,
        description: siteMetadata.description,
        publisher: {
          "@id": `${siteMetadata.url}/#organization`,
        },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: `${siteMetadata.url}/?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        ],
      },
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <div className="mt-auto">
            <Footer footer={footer} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}