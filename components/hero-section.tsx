"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, useAnimation, useInView } from "framer-motion"
import { Star, ArrowRight, Sparkles, BookOpen, Brain } from "lucide-react"
import confetti from "canvas-confetti"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoverButton, setHoverButton] = useState(false)
  const confettiRef = useRef<HTMLButtonElement>(null)
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const handleConfetti = () => {
    if (confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect()
      const x = (rect.left + rect.width / 2) / window.innerWidth
      const y = (rect.top + rect.height / 2) / window.innerHeight

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y },
        colors: ["#ffbf00", "#00a8e8", "#4cd964", "#0e2e47"],
      })
    }
  }

  const floatingElements = [
    { icon: <Star className="h-full w-full" />, color: "bg-[#ffbf00]", size: "h-12 w-12", delay: 0 },
    { icon: <BookOpen className="h-full w-full" />, color: "bg-[#00a8e8]", size: "h-10 w-10", delay: 0.5 },
    { icon: <Brain className="h-full w-full" />, color: "bg-[#4cd964]", size: "h-8 w-8", delay: 1 },
    { icon: <Sparkles className="h-full w-full" />, color: "bg-[#ffbf00]", size: "h-6 w-6", delay: 1.5 },
  ]

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const illustrationVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2,
      },
    },
    hover: {
      scale: 1.05,
      rotate: 5,
      transition: { duration: 0.3 },
    },
  }

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-[#e6f7ff] to-white py-16 md:py-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-[#00a8e8]/10 to-[#4cd964]/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center space-y-6"
          >
            <motion.div className="space-y-2" variants={containerVariants}>
              <motion.div
                custom={0}
                variants={textVariants}
                className="inline-flex items-center gap-2 rounded-full bg-[#ffbf00]/20 px-4 py-1 text-sm font-medium text-[#0e2e47]"
              >
                <Sparkles className="h-4 w-4 text-[#ffbf00]" />
                <span>Making Learning Exciting</span>
              </motion.div>

              <motion.h1
                custom={1}
                variants={textVariants}
                className="text-3xl font-bold tracking-tighter text-[#0e2e47] sm:text-4xl md:text-5xl lg:text-6xl"
              >
                Make Learning{" "}
                <motion.span
                  className="text-[#00a8e8] inline-block"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  Fun
                </motion.span>{" "}
                with Study Buddy!
              </motion.h1>

              <motion.p
                custom={2}
                variants={textVariants}
                className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
              >
                Personalized tutoring that helps students excel in their studies while having a great time learning.
              </motion.p>
            </motion.div>

            <motion.div custom={3} variants={textVariants} className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                ref={confettiRef}
                className="bg-[#ffbf00] hover:bg-[#ffa500] text-[#0e2e47] font-bold h-12 px-6 relative overflow-hidden group"
                onClick={handleConfetti}
                onMouseEnter={() => setHoverButton(true)}
                onMouseLeave={() => setHoverButton(false)}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-[#ffbf00] to-[#ffa500] opacity-0 group-hover:opacity-100"
                  initial={{ x: "-100%" }}
                  animate={hoverButton ? { x: "0%" } : { x: "-100%" }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span className="relative flex items-center">
                  Get Started
                  <motion.span
                    animate={{ x: hoverButton ? [0, 5, 0] : 0 }}
                    transition={{ duration: 0.5, repeat: hoverButton ? Number.POSITIVE_INFINITY : 0 }}
                  >
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.span>
                </motion.span>
              </Button>

              <Button
                variant="outline"
                className="border-[#00a8e8] text-[#00a8e8] hover:bg-[#e6f7ff] h-12 px-6 relative overflow-hidden group"
              >
                <motion.span
                  className="absolute inset-0 bg-[#e6f7ff] opacity-0 group-hover:opacity-100"
                  initial={{ y: "100%" }}
                  whileHover={{ y: "0%" }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative">Learn More</span>
              </Button>
            </motion.div>

            <motion.div custom={4} variants={textVariants} className="flex items-center gap-4 text-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <Star className="h-5 w-5 fill-[#ffbf00] text-[#ffbf00]" />
                  </motion.div>
                ))}
              </div>
              <div className="text-gray-500">Trusted by 1000+ parents</div>
            </motion.div>

            {/* Interactive counter */}
            <motion.div custom={5} variants={textVariants} className="flex flex-wrap gap-6 mt-4">
              {[
                { label: "Students Helped", value: 5000, color: "#00a8e8" },
                { label: "Subjects Covered", value: 25, color: "#ffbf00" },
                { label: "Qualified Tutors", value: 50, color: "#4cd964" },
              ].map((stat, index) => (
                <motion.div key={index} className="flex flex-col" whileHover={{ scale: 1.05 }}>
                  <CounterAnimation
                    targetValue={stat.value}
                    className={`text-2xl font-bold`}
                    style={{ color: stat.color }}
                  />
                  <span className="text-sm text-gray-500">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center"
            variants={illustrationVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px]">
              <Image src="/hero-illustration.png" alt="Study Buddy Illustration" fill className="object-contain" />

              {/* Interactive elements around the illustration */}
              <motion.div
                className="absolute top-[10%] right-[10%] h-16 w-16 cursor-pointer"
                whileHover={{ scale: 1.2, rotate: 10 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              >
                <Image src="/math-icon.png" alt="Math" width={64} height={64} className="object-contain" />
              </motion.div>

              <motion.div
                className="absolute bottom-[15%] left-[5%] h-16 w-16 cursor-pointer"
                whileHover={{ scale: 1.2, rotate: -10 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.5 }}
              >
                <Image src="/science-icon.png" alt="Science" width={64} height={64} className="object-contain" />
              </motion.div>

              <motion.div
                className="absolute top-[40%] left-[0%] h-16 w-16 cursor-pointer"
                whileHover={{ scale: 1.2, rotate: 10 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 1 }}
              >
                <Image src="/language-icon.png" alt="Language" width={64} height={64} className="object-contain" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute ${element.size} rounded-full ${element.color} opacity-20 flex items-center justify-center text-white`}
          style={{
            top: `${20 + index * 20}%`,
            left: `${10 + index * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 3 + index,
            delay: element.delay,
          }}
        >
          {element.icon}
        </motion.div>
      ))}

      {/* Interactive wave at the bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-[50px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#ffffff"
            animate={{
              d: [
                "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z",
                "M321.39,56.44c58-10.79,114.16-40.13,172-51.86,82.39-16.72,168.19-7.73,250.45,9.61C823.78,31,906.67,82,985.66,102.83c70.05,18.48,146.53,16.09,214.34-7V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z",
                "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z",
              ],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 10,
              ease: "easeInOut",
            }}
          ></motion.path>
        </svg>
      </div>
    </section>
  )
}

// Counter animation component
function CounterAnimation({
  targetValue,
  className = "",
  style = {},
}: {
  targetValue: number
  className?: string
  style?: React.CSSProperties
}) {
  const [count, setCount] = useState(0)
  const counterRef = useRef(null)
  const inView = useInView(counterRef)

  useEffect(() => {
    if (!inView) return

    let startTime: number
    let animationFrameId: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / 2000, 1)
      setCount(Math.floor(progress * targetValue))

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      }
    }

    animationFrameId = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [targetValue, inView])

  return (
    <span ref={counterRef} className={className} style={style}>
      {count.toLocaleString()}+
    </span>
  )
}
