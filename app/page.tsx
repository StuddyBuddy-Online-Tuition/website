import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import WhyUsSection from "@/components/why-us-section"
import TeachersSection from "@/components/teachers-section"
import SubjectsSection from "@/components/subjects-section"
import ContactSection from "@/components/contact-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <WhyUsSection />
        <TeachersSection />
        <SubjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
