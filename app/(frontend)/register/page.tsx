import type { Metadata } from "next"
import RegisterPageClient from "@/components/register/register-page.client"
import { getSubjectsContent } from "@/lib/subjects"
import { getRegisterContent } from "@/lib/register"
import { absoluteUrl, siteMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const registerContent = await getRegisterContent()
  const title = "Register for Tutoring"
  const description =
    registerContent.description ||
    "Share your details so the StudyBuddy Tutors team can match your child with a specialist teacher and schedule classes."
  const canonicalUrl = absoluteUrl("/register")

  return {
    title,
    description,
    keywords: [
      ...siteMetadata.keywords,
      "StudyBuddy registration",
      "tutor sign up",
      "enrolment form",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      type: "website",
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

type CmsPackage = {
  id: string
  name: string
  grade: string
  price?: number | null
  subjects?: { label?: string | null }[] | null
  popular?: boolean | null
}

function mapCmsPackages(list: CmsPackage[] = []) {
  return list.map((p) => ({
    id: p.id,
    tier: p.grade,
    subjects: (Array.isArray(p.subjects) ? p.subjects : []).map((s) => s?.label).filter(Boolean) as string[],
    normalPriceMonthly: typeof p.price === "number" ? p.price : 0,
    popular: !!p.popular,
  }))
}

export default async function RegisterPage() {
  const subjects = await getSubjectsContent()
  const cmsPackages = Array.isArray(subjects.packages) ? (subjects.packages as unknown as CmsPackage[]) : []
  const packages = mapCmsPackages(cmsPackages)
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? null
  const registerContent = await getRegisterContent()
  const structuredGraph = [
    {
      "@type": "WebPage",
      "@id": `${absoluteUrl("/register")}#page`,
      url: absoluteUrl("/register"),
      name: registerContent.title || "StudyBuddy Tutors Registration",
      description:
        registerContent.description ||
        "Submit the StudyBuddy Tutors enrolment form to match your child with an experienced tutor.",
      publisher: { "@id": `${siteMetadata.url}/#organization` },
    },
    packages.length
      ? {
          "@type": "Service",
          "@id": `${absoluteUrl("/register")}#tutoring-service`,
          serviceType: "Personalised tutoring programmes",
          provider: { "@id": `${siteMetadata.url}/#organization` },
          areaServed: { "@type": "Country", name: "Malaysia" },
          offers: packages.map((pkg) => ({
            "@type": "Offer",
            name: pkg.tier,
            priceCurrency: "MYR",
            price: Number.isFinite(pkg.normalPriceMonthly) ? pkg.normalPriceMonthly : undefined,
            availability: "https://schema.org/InStock",
            category: pkg.tier,
            url: absoluteUrl("/register"),
          })),
        }
      : null,
  ].filter(Boolean)

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": structuredGraph,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <RegisterPageClient
        packages={packages}
        recaptchaSiteKey={recaptchaSiteKey}
        title={registerContent.title || "Enroll Your Child with StudyBuddy"}
        description={
          registerContent.description || "Share a few details and we'll match your child with the perfect tutor."
        }
        gradeLabel={registerContent.gradeLabel || "Choose Grade (For Year 2026)"}
        subjects={Array.isArray(registerContent.subjects) ? registerContent.subjects : []}
      />
    </>
  )
}