import { Suspense } from "react"
import type { Metadata } from "next"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import WhyUsSection from "@/components/why-us-section"
import OrbsBackground from "@/components/shared/orbs-background"
import TeachersSection from "@/components/teachers-section"
import SubjectsSection from "@/components/subjects-section"
import ContactSection from "@/components/contact-section"
import { getHeroContent } from "@/lib/hero"
import { getAboutContent } from "@/lib/about"
import { getWhyUsContent } from "@/lib/why-us"
import { getTeachersContent } from "@/lib/teachers"
import { getSubjectsContent } from "@/lib/subjects"
import { getContactContent } from "@/lib/contact"
import { absoluteUrl, resolveImageUrl, siteMetadata } from "@/lib/seo"
import type { Hero as HeroContent, Teacher as TeachersContent, Subject as SubjectsContent, Contact as ContactContent } from "@/payload-types"

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getHeroContent()
  const pageTitle = "Personalized Online Tutors"
  const description =
    hero?.description ||
    "StudyBuddy Tutors connects Malaysian students with experienced educators for engaging hybrid and online lessons across core subjects."
  const heroImage = getPrimaryHeroImage(hero)
  const canonicalUrl = absoluteUrl("/")

  return {
    title: pageTitle,
    description,
    keywords: siteMetadata.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      type: "website",
      title: pageTitle,
      description,
      siteName: siteMetadata.name,
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: "StudyBuddy Tutors students learning together",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [heroImage],
    },
  }
}

export default async function Home() {
  const [hero, about, whyUs, teachers, subjects, contact] = await Promise.all([
    getHeroContent(),
    getAboutContent(),
    getWhyUsContent(),
    getTeachersContent(),
    getSubjectsContent(),
    getContactContent(),
  ])

  const heroImage = getPrimaryHeroImage(hero)
  const teacherEntries = Array.isArray(teachers?.teachers) ? (teachers.teachers as NonNullable<TeachersContent["teachers"]>) : []
  const subjectItems = extractSubjectCourses(subjects)
  const contactInfo = extractContactDetails(contact)

  const structuredGraph = [
    {
      "@type": "WebPage",
      "@id": `${absoluteUrl("/") }#home`,
      url: absoluteUrl("/"),
      name: "StudyBuddy Tutors Homepage",
      description: hero?.description || siteMetadata.description,
      primaryImageOfPage: heroImage,
      inLanguage: siteMetadata.locale,
      about: subjectItems.slice(0, 6).map((item) => item.name),
      publisher: {
        "@id": `${siteMetadata.url}/#organization`,
      },
    },
    teacherEntries.length
      ? {
          "@type": "ItemList",
          "@id": `${absoluteUrl("/")}#teachers-list`,
          name: teachers?.title || "Featured StudyBuddy Tutors",
          description: teachers?.description || "Meet the tutors leading StudyBuddy classes.",
          itemListElement: teacherEntries.map((teacher, index) => {
            const subjectsTaught =
              Array.isArray(teacher?.subjects) && teacher.subjects
                ? teacher.subjects.map((subject) => subject?.label).filter(Boolean)
                : []
            const photo = typeof teacher?.photo?.image === "string" ? undefined : teacher?.photo?.image?.url
            return {
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Person",
                "@id": `${absoluteUrl("/")}#teacher-${slugify(teacher?.name ?? `tutor-${index + 1}`)}`,
                name: teacher?.name,
                description: teacher?.description,
                jobTitle: teacher?.title,
                knowsAbout: subjectsTaught,
                image: resolveImageUrl(photo) ?? heroImage,
                url: absoluteUrl("/#teachers"),
                worksFor: {
                  "@id": `${siteMetadata.url}/#organization`,
                },
              },
            }
          }),
        }
      : null,
    subjectItems.length
      ? {
          "@type": "ItemList",
          "@id": `${absoluteUrl("/")}#subjects-list`,
          name: subjects?.title || "Subjects We Teach",
          description: subjects?.description,
          itemListElement: subjectItems.map((subject, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Course",
              "@id": `${absoluteUrl("/")}#course-${slugify(subject.name)}`,
              name: subject.name,
              description: subject.description,
              provider: {
                "@id": `${siteMetadata.url}/#organization`,
              },
              audience: subject.audience,
            },
          })),
        }
      : null,
    contactInfo
      ? {
          "@type": "ContactPoint",
          "@id": `${absoluteUrl("/")}#contact`,
          contactType: "customer service",
          telephone: contactInfo.phone,
          email: contactInfo.email,
          areaServed: "MY",
          availableLanguage: ["en", "ms"],
          hoursAvailable: contactInfo.hours,
          url: absoluteUrl("/#contact"),
        }
      : null,
  ].filter(Boolean)

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": structuredGraph,
  }

  return (
    <div className="min-h-screen bg-white">
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <HeroSection hero={hero} />
        {/* Shared orbs background wrapper for About + Why Us sections */}
        <div className="relative overflow-hidden">
          <OrbsBackground className="z-10" />
          <div className="relative z-20">
            <AboutSection about={about} />
            <WhyUsSection whyUs={whyUs} />
          </div>
        </div>
        <TeachersSection teachers={teachers} />
        <SubjectsSection subjects={subjects} />
        <Suspense fallback={null}>
          <ContactSection contact={contact} />
        </Suspense>
      </main>
    </div>
  )
}

function getPrimaryHeroImage(hero: HeroContent) {
  const carousel = Array.isArray(hero?.carousel) ? hero.carousel : []
  for (const item of carousel) {
    if (item && typeof item === "object" && item.image && typeof item.image !== "string") {
      const imageUrl = item.image.url
      if (imageUrl) {
        return resolveImageUrl(imageUrl) ?? absoluteUrl(siteMetadata.logoPath)
      }
    }
  }
  return absoluteUrl(siteMetadata.logoPath)
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

function extractSubjectCourses(subjects: SubjectsContent) {
  if (!subjects?.categories) {
    return []
  }

  const categories = subjects.categories as {
    primary?: { subjects?: { title?: string | null; shortDescription?: string | null }[] | null } | null
    lowerSecondary?: { subjects?: { title?: string | null; shortDescription?: string | null }[] | null } | null
    upperSecondary?: { subjects?: { title?: string | null; shortDescription?: string | null }[] | null } | null
  }

  const entries: { name: string; description: string; audience: { "@type": "Audience"; audienceType: string } }[] = []
  const pushSubjects = (list: { title?: string | null; shortDescription?: string | null }[] | null | undefined, audienceType: string) => {
    if (!Array.isArray(list)) {
      return
    }
    list.forEach((subject) => {
      if (!subject?.title) {
        return
      }
      entries.push({
        name: subject.title,
        description: subject.shortDescription || "",
        audience: {
          "@type": "Audience",
          audienceType,
        },
      })
    })
  }

  pushSubjects(categories.primary?.subjects ?? null, "Primary school students")
  pushSubjects(categories.lowerSecondary?.subjects ?? null, "Lower secondary students")
  pushSubjects(categories.upperSecondary?.subjects ?? null, "Upper secondary students")

  return entries
}

function extractContactDetails(contact: ContactContent | null | undefined) {
  if (!contact?.contactInfo) {
    return null
  }

  const phone = contact.contactInfo.phone || null
  const email = contact.contactInfo.email || null
  const hours = contact.workingHours
    ? [
        {
          "@type": "OpeningHoursSpecification",
          description: contact.workingHours,
        },
      ]
    : undefined

  if (!phone && !email) {
    return null
  }

  return {
    phone,
    email,
    hours,
  }
}
