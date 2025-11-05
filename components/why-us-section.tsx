"use client"

import { useRef, useState } from "react"
import { useInView } from "framer-motion"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Star, Clock, Sparkles, Target, Lightbulb, Plus } from "lucide-react"

export default function WhyUsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null)

  const features = [
    {
      icon: <Sparkles className="h-10 w-10 text-[#ffbf00]" />,
      title: "Fun Learning Environment",
      description: "We make learning enjoyable with interactive lessons and engaging activities.",
      expandedContent:
        "Our tutors use games, interactive exercises, and real-world examples to make learning fun and memorable. Students are more engaged when they're enjoying themselves, which leads to better retention and understanding of concepts.",
      color: "bg-[#fff2cc]",
      hoverColor: "hover:bg-[#fff2cc]",
      textColor: "text-[#ffbf00]",
    },
    {
      icon: <Target className="h-10 w-10 text-[#00a8e8]" />,
      title: "Personalized Approach",
      description: "Customized learning plans tailored to each student's unique needs and goals.",
      expandedContent:
        "We begin with a comprehensive assessment to understand your child's learning style, strengths, and areas for improvement. Then we create a personalized learning plan that adapts as they progress, ensuring they're always appropriately challenged.",
      color: "bg-[#e6f7ff]",
      hoverColor: "hover:bg-[#e6f7ff]",
      textColor: "text-[#00a8e8]",
    },
    {
      icon: <Star className="h-10 w-10 text-[#4cd964]" />,
      title: "Qualified Tutors",
      description: "Experienced educators who are experts in their subjects and passionate about teaching.",
      expandedContent:
        "Our tutors are not only subject matter experts but also trained in effective teaching methods. They undergo rigorous screening and training to ensure they can connect with students and explain complex concepts in accessible ways.",
      color: "bg-[#e6ffea]",
      hoverColor: "hover:bg-[#e6ffea]",
      textColor: "text-[#4cd964]",
    },
    {
      icon: <Clock className="h-10 w-10 text-[#ff3b30]" />,
      title: "Flexible Scheduling",
      description: "Convenient session times that fit into your busy family schedule.",
      expandedContent:
        "We understand that families are busy. That's why we offer sessions seven days a week, with early morning and evening options available. Our online tutoring option provides even more flexibility for families on the go.",
      color: "bg-[#ffebe9]",
      hoverColor: "hover:bg-[#ffebe9]",
      textColor: "text-[#ff3b30]",
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-[#00a8e8]" />,
      title: "Proven Results",
      description: "Our students consistently show improvement in grades and confidence.",
      expandedContent:
        "We track progress carefully and can demonstrate measurable improvements in academic performance. Beyond grades, we see our students develop greater confidence, improved study habits, and a genuine love of learning.",
      color: "bg-[#e6f7ff]",
      hoverColor: "hover:bg-[#e6f7ff]",
      textColor: "text-[#00a8e8]",
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-[#ffbf00]" />,
      title: "Critical Thinking",
      description: "We develop problem-solving skills that extend beyond the classroom.",
      expandedContent:
        "Rather than just teaching facts, we focus on developing critical thinking and problem-solving skills. These transferable skills help students succeed not just in their current classes, but throughout their academic careers and beyond.",
      color: "bg-[#fff2cc]",
      hoverColor: "hover:bg-[#fff2cc]",
      textColor: "text-[#ffbf00]",
    },
  ]

  const toggleFeature = (index: number) => {
    if (expandedFeature === index) {
      setExpandedFeature(null)
    } else {
      setExpandedFeature(index)
    }
  }

  // Background orbs moved to a shared wrapper in app/page.tsx

  return (
    <section id="why-us" ref={ref} className="relative overflow-hidden py-16 md:py-24 bg-transparent">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block rounded-lg bg-[#fff2cc] px-3 py-1 text-sm text-[#ffbf00]">Why Choose Us</div>
            <h2 className="text-3xl font-bold tracking-tighter text-[#0e2e47] sm:text-4xl md:text-5xl">
              What Makes Study Buddy Special
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We're not just tutors - we're learning partners who make education exciting and effective.
            </p>
          </motion.div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              style={{
                transform: isInView ? "none" : "translateY(50px)",
                opacity: isInView ? 1 : 0,
                transition: `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ${0.1 * index}s`,
              }}
              className={`flex flex-col items-center space-y-4 rounded-lg border bg-white p-6 shadow-sm transition-all ${feature.hoverColor} cursor-pointer`}
              onClick={() => toggleFeature(index)}
              whileHover={{ y: -5 }}
              layout
            >
              <motion.div
                className={`rounded-full ${feature.color} p-3`}
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-[#0e2e47]">{feature.title}</h3>
              <p className="text-center text-gray-600">{feature.description}</p>

              <AnimatePresence>
                {expandedFeature === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-gray-600 mt-2 border-t pt-4">{feature.expandedContent}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className={`flex items-center justify-center ${feature.textColor} mt-2`}
                whileHover={{ scale: 1.1 }}
              >
                {expandedFeature === index ? (
                  <span className="text-sm font-medium">Show less</span>
                ) : (
                  <span className="text-sm font-medium flex items-center">
                    Learn more <Plus className="ml-1 h-3 w-3" />
                  </span>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background orbs are provided by a shared wrapper in app/page.tsx */}
    </section>
  )
}
