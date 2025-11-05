"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import Image from "next/image"
import { motion } from "framer-motion"

export default function TeachersSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const teachers = [
    {
      name: "Ms. Sarah Johnson",
      role: "Math Specialist",
      image: "/t3.jpeg",
      description: "With 10+ years of experience teaching mathematics, Ms. Johnson makes numbers fun!",
      subjects: ["Algebra", "Geometry", "Calculus"],
    },
    {
      name: "Mr. David Chen",
      role: "Science Expert",
      image: "/t1.jpeg",
      description: "Mr. Chen brings science to life through exciting experiments and clear explanations.",
      subjects: ["Physics", "Chemistry", "Biology"],
    },
    {
      name: "Mrs. Emily Rodriguez",
      role: "Language Arts Tutor",
      image: "/t2.jpeg",
      description: "Mrs. Rodriguez inspires a love of reading and writing in all her students.",
      subjects: ["English", "Literature", "Writing"],
    },
    {
      name: "Dr. Michael Lee",
      role: "History & Social Studies",
      image: "/t4.jpg",
      description: "Dr. Lee makes history fascinating with his storytelling approach to teaching.",
      subjects: ["History", "Geography", "Social Studies"],
    },
  ]

  return (
    <section id="teachers" ref={ref} className="py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-[#e6ffea] px-3 py-1 text-sm text-[#4cd964]">Our Teachers</div>
            <h2 className="text-3xl font-bold tracking-tighter text-[#0e2e47] sm:text-4xl md:text-5xl">
              Meet Our Amazing Tutors
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our passionate educators are dedicated to helping your child succeed.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
          {teachers.map((teacher, index) => (
            <motion.div
              key={index}
              style={{
                transform: isInView ? "none" : "translateY(50px)",
                opacity: isInView ? 1 : 0,
                transition: `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ${0.1 * index}s`,
              }}
              className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  src={teacher.image || "/placeholder.svg"}
                  alt={teacher.name}
                  width={300}
                  height={300}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-[#0e2e47]">{teacher.name}</h3>
                <p className="text-[#00a8e8] font-medium">{teacher.role}</p>
                <p className="mt-2 text-sm text-gray-600">{teacher.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {teacher.subjects.map((subject, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-full bg-[#e6f7ff] px-2.5 py-0.5 text-xs font-medium text-[#00a8e8]"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
