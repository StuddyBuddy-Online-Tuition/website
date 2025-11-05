"use client"

import { useMemo, useRef, useState, useEffect } from "react"
import { useInView } from "framer-motion"
import { motion, AnimatePresence } from "framer-motion"
import { Calculator, Atom, BookOpen, Globe, Code, Music, Palette, Languages, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SubjectsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("elementary")
  const [hoveredSubject, setHoveredSubject] = useState<number | null>(null)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [mobilePage, setMobilePage] = useState(0)

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)")
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    setIsMobile(mql.matches)
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", listener)
      return () => mql.removeEventListener("change", listener)
    } else {
      // Safari
      // @ts-ignore
      mql.addListener(listener)
      // @ts-ignore
      return () => mql.removeListener(listener)
    }
  }, [])

  const subjectCategories = {
    elementary: [
      { icon: <BookOpen className="h-6 w-6" />, name: "English", description: "Personalized tutoring in English." },
      { icon: <Languages className="h-6 w-6" />, name: "Bahasa Malaysia", description: "Bantuan pembelajaran Bahasa Malaysia." },
      { icon: <Calculator className="h-6 w-6" />, name: "Mathematics", description: "Core math skills and problem solving." },
      { icon: <Atom className="h-6 w-6" />, name: "Science", description: "Foundational science concepts." },
      { icon: <Globe className="h-6 w-6" />, name: "Sejarah", description: "Introductory history and timelines." },
    ],
    high: [
      { icon: <BookOpen className="h-6 w-6" />, name: "English", description: "Advanced English skills and exam prep." },
      { icon: <Languages className="h-6 w-6" />, name: "Bahasa Malaysia", description: "Pengukuhan Bahasa Malaysia dan persediaan peperiksaan." },
      { icon: <Calculator className="h-6 w-6" />, name: "Mathematics", description: "Comprehensive mathematics tutoring." },
      { icon: <Calculator className="h-6 w-6" />, name: "Addmath", description: "Additional mathematics topics and techniques." },
      { icon: <Atom className="h-6 w-6" />, name: "Science", description: "General science concepts and applications." },
      { icon: <Globe className="h-6 w-6" />, name: "Sejarah", description: "Malaysian and world history topics." },
      { icon: <Atom className="h-6 w-6" />, name: "Kimia", description: "Chemistry principles and problem solving." },
      { icon: <Atom className="h-6 w-6" />, name: "Biology", description: "Biology concepts and exam strategies." },
      { icon: <Atom className="h-6 w-6" />, name: "Physics", description: "Physics fundamentals and calculations." },
      { icon: <Globe className="h-6 w-6" />, name: "Geography", description: "Physical and human geography." },
      { icon: <Calculator className="h-6 w-6" />, name: "Prinsip Akaun", description: "Principles of accounting." },
      { icon: <Calculator className="h-6 w-6" />, name: "Ekonomi", description: "Economics theory and practice." },
      { icon: <Calculator className="h-6 w-6" />, name: "Perniagaan", description: "Business studies essentials." },
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
    elementary: { bg: "bg-[#00a8e8]", text: "text-[#00a8e8]", hover: "hover:bg-[#e6f7ff]", ring: "ring-[#00a8e8]" },
    high: { bg: "bg-[#4cd964]", text: "text-[#4cd964]", hover: "hover:bg-[#e6ffea]", ring: "ring-[#4cd964]" },
  }

  const PAGE_SIZE = 6
  const MAX_SUBJECTS = 6

  return (
    <section id="subjects" ref={ref} className="py-16 md:py-24 bg-[#f8fafc] relative">
      <div className="relative z-10 container px-4 md:px-6">
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
          <Tabs
            defaultValue="elementary"
            className="w-full"
            onValueChange={(v) => {
              setActiveTab(v)
              setMobilePage(0)
            }}
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              {Object.entries(tabColors).map(([level, colors]) => (
                <TabsTrigger
                  key={level}
                  value={level}
                  className={`text-base relative overflow-hidden ${
                    activeTab === level ? `${colors.bg} text-white ring-2 ${colors.ring} shadow-sm` : ""
                  }`}
                >
                  <motion.span
                    className={`absolute inset-0 ${activeTab === level ? "opacity-40" : "opacity-20"}`}
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
                  {(isMobile
                    ? subjects
                        .slice(0, MAX_SUBJECTS)
                        .slice(mobilePage * PAGE_SIZE, mobilePage * PAGE_SIZE + PAGE_SIZE)
                    : subjects.slice(0, MAX_SUBJECTS)
                  ).map((subject, index) => (
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

                {isMobile && Math.min(subjects.length, MAX_SUBJECTS) > PAGE_SIZE && (
                  <div className="mt-6 flex items-center justify-center gap-3 sm:hidden">
                    <Button
                      variant="outline"
                      onClick={() => setMobilePage((p) => Math.max(0, p - 1))}
                      disabled={mobilePage === 0}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {mobilePage + 1} of {Math.ceil(Math.min(subjects.length, MAX_SUBJECTS) / PAGE_SIZE)}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setMobilePage((p) =>
                          Math.min(
                            Math.ceil(Math.min(subjects.length, MAX_SUBJECTS) / PAGE_SIZE) - 1,
                            p + 1
                          )
                        )
                      }
                      disabled={mobilePage >= Math.ceil(Math.min(subjects.length, MAX_SUBJECTS) / PAGE_SIZE) - 1}
                    >
                      Next
                    </Button>
                  </div>
                )}

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
                      onClick={() => {
                        const list = selectedSubjects.slice(0, 6)
                        const q = list.map((s) => encodeURIComponent(s)).join(",")
                        router.push(`/?subjects=${q}#contact`)
                      }}
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[
          { icon: <Calculator className="h-full w-full text-[#00a8e8]/30" />, size: 40 },
          { icon: <BookOpen className="h-full w-full text-[#ffbf00]/30" />, size: 50 },
          { icon: <Atom className="h-full w-full text-[#4cd964]/30" />, size: 45 },
          { icon: <Globe className="h-full w-full text-[#00a8e8]/30" />, size: 35 },
          { icon: <Code className="h-full w-full text-[#ffbf00]/30" />, size: 30 },
          { icon: <Music className="h-full w-full text-[#4cd964]/30" />, size: 34 },
          { icon: <Palette className="h-full w-full text-[#00a8e8]/30" />, size: 28 },
          { icon: <Languages className="h-full w-full text-[#ffbf00]/30" />, size: 38 },
          { icon: <Calculator className="h-full w-full text-[#00a8e8]/30" />, size: 26 },
          { icon: <Atom className="h-full w-full text-[#4cd964]/30" />, size: 32 },
          { icon: <Globe className="h-full w-full text-[#00a8e8]/30" />, size: 44 },
          { icon: <BookOpen className="h-full w-full text-[#ffbf00]/30" />, size: 36 },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              ...useMemo(() => {
                // deterministic seeded random per index
                let seed = 9000 + i * 101
                const rand = () => {
                  seed = (seed * 1664525 + 1013904223) % 4294967296
                  return seed / 4294967296
                }
                return {
                  top: `${rand() * 80 + 10}%`,
                  left: `${rand() * 80 + 10}%`,
                }
              }, [i]),
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
