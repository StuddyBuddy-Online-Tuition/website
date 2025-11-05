"use client"

import { useRef, useState } from "react"
import { useInView } from "framer-motion"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Users, Award, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [activeIndex, setActiveIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  const missionPoints = [
    {
      title: "Our Mission",
      icon: <BookOpen className="h-5 w-5 text-[#00a8e8]" />,
      description:
        "To create a supportive learning environment where students can build confidence and achieve academic success.",
      details:
        "We prioritize strong fundamentals, consistent practice, and individualized feedback. Our programs are designed to turn small daily wins into lasting academic growth.",
      color: "bg-[#e6f7ff]",
      textColor: "text-[#00a8e8]",
    },
    {
      title: "Our Team",
      icon: <Users className="h-5 w-5 text-[#ffbf00]" />,
      description: "Experienced educators who are experts in their fields and passionate about helping students learn.",
      details:
        "Every tutor is carefully vetted and trained in our coaching playbook—mixing subject expertise with mentorship that builds motivation and healthy study habits.",
      color: "bg-[#fff2cc]",
      textColor: "text-[#ffbf00]",
    },
    {
      title: "Our Approach",
      icon: <Award className="h-5 w-5 text-[#4cd964]" />,
      description: "Personalized learning plans that adapt to each student's unique needs, learning style, and pace.",
      details:
        "We start with a simple assessment, define clear goals with families, and adjust plans weekly based on progress so every session moves the student forward.",
      color: "bg-[#e6ffea]",
      textColor: "text-[#4cd964]",
    },
  ]

  const nextSlide = () => {
    setIsExpanded(false)
    setActiveIndex((prev) => (prev === missionPoints.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setIsExpanded(false)
    setActiveIndex((prev) => (prev === 0 ? missionPoints.length - 1 : prev - 1))
  }

  return (
    <section id="about" ref={ref} className="py-16 md:py-24 bg-transparent">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block rounded-lg bg-[#e6f7ff] px-3 py-1 text-sm text-[#00a8e8]">About Us</div>
            <h2 className="text-3xl font-bold tracking-tighter text-[#0e2e47] sm:text-4xl md:text-5xl">Who We Are</h2>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Study Buddy is a team of passionate educators dedicated to making learning enjoyable and effective for
              students of all ages.
            </p>
          </motion.div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <motion.div
            style={{
              transform: isInView ? "none" : "translateX(-50px)",
              opacity: isInView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s",
            }}
            className="relative h-[300px] overflow-hidden rounded-xl border-8 border-white shadow-xl"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <Image src="/about-image.webp" alt="Happy students learning" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0e2e47]/20 to-transparent" />

            {/* Interactive overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-[#0e2e47]/60">
              <Button className="bg-white text-[#0e2e47] hover:bg-[#e6f7ff]">Learn More About Us</Button>
            </div>
          </motion.div>
          <motion.div
            style={{
              transform: isInView ? "none" : "translateX(50px)",
              opacity: isInView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.4s",
            }}
            className="space-y-6"
          >
            <div className="relative overflow-hidden">
              {/* Carousel navigation */}
              <div className="flex justify-between mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  className="rounded-full border-[#00a8e8] text-[#00a8e8] hover:bg-[#e6f7ff]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex space-x-2">
                  {missionPoints.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveIndex(index)
                        setIsExpanded(false)
                      }}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        index === activeIndex ? "bg-[#00a8e8]" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  className="rounded-full border-[#00a8e8] text-[#00a8e8] hover:bg-[#e6f7ff]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Carousel content with expandable card (hover or click) */}
              <div className="relative min-h-[200px]">
                <motion.div
                  key={activeIndex}
                  layout
                  className={`flex flex-col p-6 rounded-lg border ${missionPoints[activeIndex].color}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  onMouseEnter={() => setIsExpanded(true)}
                  onMouseLeave={() => setIsExpanded(false)}
                  onClick={() => setIsExpanded((prev) => !prev)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${missionPoints[activeIndex].color}`}
                    >
                      {missionPoints[activeIndex].icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-[#0e2e47]">
                        {missionPoints[activeIndex].title}
                      </h3>
                      <p className="text-gray-600">{missionPoints[activeIndex].description}</p>
                    </div>
                  </div>
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.p
                        key="details"
                        className="mt-4 text-gray-600"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {missionPoints[activeIndex].details}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>

            {/* Interactive facts */}
            <div className="grid grid-cols-3 gap-4 mt-2">
              {[
                { value: "10+", label: "Years Experience" },
                { value: "95%", label: "Success Rate" },
                { value: "24/7", label: "Support" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-[#f8fafc] hover:bg-[#e6f7ff] transition-colors cursor-pointer"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl font-bold text-[#00a8e8]">{stat.value}</span>
                  <span className="text-xs text-gray-500 text-center">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
