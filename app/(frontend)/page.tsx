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

export default async function Home() {
  const [hero, about, whyUs, teachers, subjects, contact] = await Promise.all([
    getHeroContent(),
    getAboutContent(),
    getWhyUsContent(),
    getTeachersContent(),
    getSubjectsContent(),
    getContactContent(),
  ])

  return (
    <div className="min-h-screen bg-white">
      <main>
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
        <ContactSection contact={contact} />
      </main>
    </div>
  )
}
