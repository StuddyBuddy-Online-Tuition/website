"use client"

import { useRef, useState } from "react"
import { useInView } from "framer-motion"
import { motion, AnimatePresence } from "framer-motion"
import { Calculator, Atom, BookOpen, Globe, Code, Music, Palette, Languages, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SubjectsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [activeTab, setActiveTab] = useState("elementary")
  const [hoveredSubject, setHoveredSubject] = useState<number | null>(null)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  const subjectCategories = {
    elementary: [
      {
        icon: <Calculator className="h-6 w-6" />,
        name: "Basic Math",
        description: "Building a strong foundation in numbers, counting, and basic operations.",
      },
      {
        icon: <BookOpen className="h-6 w-6" />,
        name: "Reading",
        description: "Developing reading skills, comprehension, and a love for books.",
      },
      {
        icon: <Palette className="h-6 w-6" />,
        name: "Writing",
        description: "Learning to express ideas through words, sentences, and stories.",
      },
      {
        icon: <Atom className="h-6 w-6" />,
        name: "Science",
        description: "Exploring the natural world through fun, hands-on experiments.",
      },
      {
        icon: <Globe className="h-6 w-6" />,
        name: "Social Studies",
        description: "Learning about communities, history, and the world around us.",
      },
      {
        icon: <Music className="h-6 w-6" />,
        name: "Arts & Crafts",
        description: "Expressing creativity through various artistic mediums.",
      },
    ],
    middle: [
      {
        icon: <Calculator className="h-6 w-6" />,
        name: "Pre-Algebra",
        description: "Preparing for algebraic concepts with number properties and equations.",
      },
      {
        icon: <BookOpen className="h-6 w-6" />,
        name: "Literature",
        description: "Analyzing texts, understanding themes, and developing critical thinking.",
      },
      {
        icon: <Palette className="h-6 w-6" />,
        name: "Essay Writing",
        description: "Crafting well-structured paragraphs and essays with clear arguments.",
      },
      {
        icon: <Atom className="h-6 w-6" />,
        name: "Life Science",
        description: "Exploring biology, ecology, and the living world around us.",
      },
      {
        icon: <Globe className="h-6 w-6" />,
        name: "World History",
        description: "Learning about civilizations, cultures, and significant historical events.",
      },
      {
        icon: <Languages className="h-6 w-6" />,
        name: "Foreign Languages",
        description: "Building vocabulary and conversation skills in a new language.",
      },
    ],
    high: [
      {
        icon: <Calculator className="h-6 w-6" />,
        name: "Algebra & Calculus",
        description: "Mastering advanced mathematical concepts and problem-solving.",
      },
      {
        icon: <Atom className="h-6 w-6" />,
        name: "Physics & Chemistry",
        description: "Understanding the fundamental laws and principles of science.",
      },
      {
        icon: <BookOpen className="h-6 w-6" />,
        name: "Advanced Literature",
        description: "Critical analysis of complex texts and literary techniques.",
      },
      {
        icon: <Palette className="h-6 w-6" />,
        name: "Research Writing",
        description: "Developing research skills and crafting academic papers.",
      },
      {
        icon: <Code className="h-6 w-6" />,
        name: "Computer Science",
        description: "Learning programming fundamentals and computational thinking.",
      },
      {
        icon: <Globe className="h-6 w-6" />,
        name: "AP/IB Subjects",
        description: "Specialized preparation for Advanced Placement and IB exams.",
      },
    ],
  }

  const toggleSubjectSelection = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject))
    } else {
      setSelectedSubjects([...selectedSubjects, subject])
    }
  }

  const tabColors = {
    elementary: { bg: "bg-[#00a8e8]", text: "text-[#00a8e8]", hover: "hover:bg-[#e6f7ff]" },
    middle: { bg: "bg-[#ffbf00]", text: "text-[#ffbf00]", hover: "hover:bg-[#fff2cc]" },
    high: { bg: "bg-[#4cd964]", text: "text-[#4cd964]", hover: "hover:bg-[#e6ffea]" },
  }

  return (
    <section id="subjects" ref={ref} className="py-16 md:py-24 bg-[#f8fafc] relative">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block rounded-lg bg-[#e6f7ff] px-3 py-1 text-sm text-[#00a8e8]">Our Subjects</div>
            <h2 className="text-3xl font-bold tracking-tighter text-[#0e2e47] sm:text-4xl md:text-5xl">
              What We Teach
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We offer tutoring in a wide range of subjects for students of all ages and levels.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto max-w-5xl py-12">
          <Tabs defaultValue="elementary" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {Object.entries(tabColors).map(([level, colors]) => (
                <TabsTrigger
                  key={level}
                  value={level}
                  className={`text-base relative overflow-hidden ${activeTab === level ? `${colors.bg} text-white` : ""}`}
                >
                  <motion.span
                    className="absolute inset-0 opacity-20"
                    initial={false}
                    animate={
                      activeTab !== level
                        ? {
                            x: "-100%",
                          }
                        : {
                            x: "0%",
                          }
                    }
                    transition={{ duration: 0.3 }}
                    style={{ background: colors.bg }}
                  />
                  <span className="relative">{level.charAt(0).toUpperCase() + level.slice(1)} School</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(subjectCategories).map(([level, subjects]) => (
              <TabsContent key={level} value={level} className="mt-0">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {subjects.map((subject, index) => (
                    <motion.div
                      key={index}
                      style={{
                        transform: isInView && activeTab === level ? "none" : "translateY(20px)",
                        opacity: isInView && activeTab === level ? 1 : 0,
                        transition: `all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) ${0.1 * index}s`,
                      }}
                      className={`flex flex-col space-y-3 rounded-xl border bg-white p-6 shadow-sm transition-all ${
                        hoveredSubject === index ? "shadow-lg" : "hover:shadow-md"
                      } ${selectedSubjects.includes(subject.name) ? "border-[#00a8e8] border-2" : ""}`}
                      onMouseEnter={() => setHoveredSubject(index)}
                      onMouseLeave={() => setHoveredSubject(null)}
                      onClick={() => toggleSubjectSelection(subject.name)}
                    >
                      <div className="relative">
                        <motion.div
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e6f7ff] text-[#00a8e8]"
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {subject.icon}
                        </motion.div>

                        {selectedSubjects.includes(subject.name) && (
                          <motion.div
                            className="absolute -top-2 -right-2 bg-[#00a8e8] text-white rounded-full p-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                          >
                            <Check className="h-4 w-4" />
                          </motion.div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-[#0e2e47]">{subject.name}</h3>
                      <p className="text-gray-600">{subject.description}</p>

                      <AnimatePresence>
                        {hoveredSubject === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <ul className="text-sm text-gray-600 space-y-1 mt-2">
                              <li className="flex items-center">
                                <Check className="h-3 w-3 text-[#00a8e8] mr-2" />
                                <span>One-on-one tutoring</span>
                              </li>
                              <li className="flex items-center">
                                <Check className="h-3 w-3 text-[#00a8e8] mr-2" />
                                <span>Homework help</span>
                              </li>
                              <li className="flex items-center">
                                <Check className="h-3 w-3 text-[#00a8e8] mr-2" />
                                <span>Test preparation</span>
                              </li>
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Button
                        variant="ghost"
                        className="mt-auto justify-start p-0 text-[#00a8e8] hover:text-[#0077b6] group"
                      >
                        Learn more
                        <motion.span
                          animate={hoveredSubject === index ? { x: 5 } : { x: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </motion.span>
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {selectedSubjects.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8 flex flex-col items-center"
                  >
                    <p className="text-gray-600 mb-4">
                      You've selected {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? "s" : ""}:
                      <span className="font-medium text-[#00a8e8]"> {selectedSubjects.join(", ")}</span>
                    </p>
                    <Button
                      className="bg-[#00a8e8] hover:bg-[#0077b6]"
                      onClick={() => alert(`You've selected: ${selectedSubjects.join(", ")}`)}
                    >
                      Request Information
                    </Button>
                  </motion.div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Animated floating subject icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { icon: <Calculator className="h-full w-full text-[#00a8e8]/10" />, size: 40 },
          { icon: <BookOpen className="h-full w-full text-[#ffbf00]/10" />, size: 50 },
          { icon: <Atom className="h-full w-full text-[#4cd964]/10" />, size: 45 },
          { icon: <Globe className="h-full w-full text-[#00a8e8]/10" />, size: 35 },
          { icon: <Code className="h-full w-full text-[#ffbf00]/10" />, size: 30 },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              width: `${item.size}px`,
              height: `${item.size}px`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 3 + i,
              delay: i * 0.5,
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
