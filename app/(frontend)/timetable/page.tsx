import type { Metadata } from "next"
import MasterTimetable from "@/components/timetable/master-timetable"
import { getAllSubjects } from "@/app/(frontend)/server/supabase/queries/subjects"
import { getAllTimeslots } from "@/app/(frontend)/server/supabase/queries/timeslots"
import { getTimetableContent } from "@/lib/timetable"
import { absoluteUrl, siteMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const timetableContent = await getTimetableContent()
  const title = timetableContent.title || "Master Timetable"
  const description =
    timetableContent.description ||
    "Browse StudyBuddy's live classroom timetable to find open slots by grade, subject, day, and time."
  const canonicalUrl = absoluteUrl("/timetable")

  return {
    title,
    description,
    keywords: [
      ...siteMetadata.keywords,
      "timetable",
      "class schedule",
      "StudyBuddy timetable",
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

export default async function MasterSubjectsTimetablePage() {
  const subjects = await getAllSubjects()
  const normalizedSubjects = subjects.map((s) => ({ ...s, standard: s.standard.toUpperCase() }))

  const timeslots = await getAllTimeslots()
  const normalTimeslots = timeslots.filter((t) => t.studentId === null)
  
  const timetableContent = await getTimetableContent()
  const availableGrades = Array.isArray(timetableContent.availableGrades) 
    ? timetableContent.availableGrades.map((g) => ({ value: g.value || '', label: g.label || '' }))
    : []

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${absoluteUrl("/timetable")}#page`,
        url: absoluteUrl("/timetable"),
        name: timetableContent.title || "StudyBuddy Tutors Timetable",
        description:
          timetableContent.description ||
          "Explore available StudyBuddy tutoring sessions organised by day, time, and standard.",
        publisher: { "@id": `${siteMetadata.url}/#organization` },
      },
      {
        "@type": "Dataset",
        "@id": `${absoluteUrl("/timetable")}#dataset`,
        name: timetableContent.title || "Master Timetable Dataset",
        description:
          timetableContent.description ||
          "Live dataset of StudyBuddy Tutors classroom timeslots by grade and subject.",
        url: absoluteUrl("/timetable"),
        creator: { "@id": `${siteMetadata.url}/#organization` },
        keywords: ["class timetable", "StudyBuddy Tutors", "subject schedule"],
        temporalCoverage: new Date().getFullYear().toString(),
        spatialCoverage: { "@type": "Country", name: "Malaysia" },
      },
    ],
  }

  return (
    <div className="bg-white py-16">
      <main>
        <div className="container px-4 md:px-6">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
          <MasterTimetable
            initialSubjects={normalizedSubjects}
            initialTimeslots={normalTimeslots}
            title={timetableContent.title || 'Master Timetable'}
            description={timetableContent.description || 'Select up to 5 standards/forms to display.'}
            availableGrades={availableGrades}
            headingLevel="h1"
          />
        </div>
      </main>
    </div>
  )
}


