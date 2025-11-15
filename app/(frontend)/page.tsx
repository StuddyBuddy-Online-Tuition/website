import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import WhyUsSection from "@/components/why-us-section"
import OrbsBackground from "@/components/shared/orbs-background"
import TeachersSection from "@/components/teachers-section"
import SubjectsSection from "@/components/subjects-section"
import ContactSection from "@/components/contact-section"
import { getHeroContent } from "@/lib/hero"

export default async function Home() {
  const hero = await getHeroContent()

  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection hero={hero} />
        {/* Shared orbs background wrapper for About + Why Us sections */}
        <div className="relative overflow-hidden">
          <OrbsBackground className="z-10" />
          <div className="relative z-20">
            <AboutSection />
            <WhyUsSection />
          </div>
        </div>
        <TeachersSection />
        <SubjectsSection />
        <ContactSection />
      </main>
    </div>
  )
}
