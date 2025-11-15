"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  BookOpen,
  Languages,
  Dna,
  Atom,
  Globe,
  Calculator,
  FlaskConical,
  X,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import type { Contact as ContactContent } from "@/payload-types"

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M21 7.2c-1.8-.2-3.5-.9-4.9-2v7.4c0 4.16-3.37 7.55-7.5 7.55S1 16.76 1 12.6c0-3.42 2.25-6.33 5.4-7.29a6.92 6.92 0 012.3-.31v3.72a3.2 3.2 0 00-.82-.1 3.2 3.2 0 103.2 3.2V2h3.48a6.82 6.82 0 004.44 2.1z" />
  </svg>
)

type ContactSectionProps = {
  contact: ContactContent
}

export default function ContactSection({ contact }: ContactSectionProps) {
  const { title, description, contactInfo, workingHours, followLinks } = contact ?? {}
  const workingHoursText = typeof workingHours === "string" ? workingHours : ""
  const workingHourLines = workingHoursText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
  const socialLinks = [
    { key: "facebookUrl", label: "Facebook", icon: Facebook },
    { key: "instagramUrl", label: "Instagram", icon: Instagram },
    { key: "tiktokUrl", label: "TikTok", icon: TikTokIcon },
    { key: "youtubeUrl", label: "YouTube", icon: Youtube },
    { key: "linkedinUrl", label: "LinkedIn", icon: Linkedin },
  ]
    .map((config) => {
      const url = followLinks ? (followLinks as Record<string, string | undefined>)[config.key] : undefined
      return url ? { ...config, url } : null
    })
    .filter((value): value is { key: string; label: string; icon: typeof Facebook; url: string } => Boolean(value))

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedPackage, setSelectedPackage] = useState<{ groupName: string; tier: string } | null>(null)
  const [topic, setTopic] = useState<string>("general")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const searchParams = useSearchParams()

  const SUBJECT_ICONS: Record<string, any> = {
    English: BookOpen,
    "Bahasa Malaysia": Languages,
    Biology: Dna,
    Biologi: Dna,
    Physics: Atom,
    Fizik: Atom,
    Geography: Globe,
    Kimia: FlaskConical,
    Mathematics: Calculator,
    Addmath: Calculator,
    Sains: FlaskConical,
    Sejarah: Globe,
    "Prinsip Akaun": Calculator,
    Ekonomi: Calculator,
    Perniagaan: Globe,
  }

  useEffect(() => {
    const raw = searchParams?.get("subjects") || ""
    if (!raw) return
    const list = raw
      .split(",")
      .map((s) => decodeURIComponent(s).trim())
      .filter(Boolean)
    const deduped = Array.from(new Set(list)).slice(0, 6)
    if (deduped.length) {
      setSelectedSubjects(deduped)
      setTopic("subjects-info")
    }
  }, [searchParams])

  useEffect(() => {
    const groupName = searchParams?.get("package_groupName") || ""
    const tier = searchParams?.get("package_tier") || ""
    if (groupName || tier) {
      setSelectedPackage({ groupName: decodeURIComponent(groupName), tier: decodeURIComponent(tier) })
    } else {
      setSelectedPackage(null)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting) return

    const form = e.currentTarget
    const formData = new FormData(form)

    const payload = {
      firstName: (formData.get("firstName") as string | null)?.trim() || "",
      lastName: (formData.get("lastName") as string | null)?.trim() || "",
      email: (formData.get("email") as string | null)?.trim() || "",
      phone: (formData.get("phone") as string | null)?.trim() || "",
      message: (formData.get("message") as string | null)?.trim() || "",
      topic,
      subjects: selectedSubjects,
      selectedPackage,
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      form.reset()
      setTopic("general")
      setSelectedSubjects([])
      setSelectedPackage(null)
      setFormSubmitted(true)
      setTimeout(() => setFormSubmitted(false), 3000)
    } catch (error) {
      setSubmitError("We couldn't send your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={ref} className="py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-[#fff2cc] px-3 py-1 text-sm text-[#ffbf00]">Get In Touch</div>
            <h2 className="text-3xl font-bold tracking-tighter text-[#0e2e47] sm:text-4xl md:text-5xl">
              {title || "Contact Us"}
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {description ||
                "Have questions? We're here to help! Reach out to us for more information about our tutoring services."}
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 py-12 lg:grid-cols-2">
          <motion.div
            style={{
              transform: isInView ? "none" : "translateX(-50px)",
              opacity: isInView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s",
            }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#0e2e47]">Contact Information</h3>
              <div className="grid gap-4">
                {contactInfo?.phone && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6f7ff]">
                      <Phone className="h-5 w-5 text-[#00a8e8]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#0e2e47]">Phone</h4>
                      <p className="text-gray-600">{contactInfo.phone}</p>
                    </div>
                  </div>
                )}
                {contactInfo?.email && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6f7ff]">
                      <Mail className="h-5 w-5 text-[#00a8e8]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#0e2e47]">Email</h4>
                      <p className="text-gray-600">{contactInfo.email}</p>
                    </div>
                  </div>
                )}
                {contactInfo?.location && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6f7ff]">
                      <MapPin className="h-5 w-5 text-[#00a8e8]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#0e2e47]">Location</h4>
                      <p className="text-gray-600 whitespace-pre-line">{contactInfo.location}</p>
                    </div>
                  </div>
                )}
                {workingHourLines.length > 0 && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6f7ff]">
                      <Clock className="h-5 w-5 text-[#00a8e8]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#0e2e47]">Hours</h4>
                      {workingHourLines.map((line, idx) => (
                        <p key={`${line}-${idx}`} className="text-gray-600">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-[#0e2e47]">Follow Us</h3>
              {socialLinks.length > 0 && (
                <div className="flex space-x-4">
                  {socialLinks.map(({ key, label, icon: Icon, url }) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="rounded-full bg-[#e6f7ff] p-2 text-[#00a8e8] hover:bg-[#00a8e8] hover:text-white transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            style={{
              transform: isInView ? "none" : "translateX(50px)",
              opacity: isInView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.4s",
            }}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >
            <h3 className="text-2xl font-bold text-[#0e2e47] mb-6">Send Us a Message</h3>
            {formSubmitted ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
                <div className="rounded-full bg-[#e6ffea] p-3">
                  <CheckCircle className="h-8 w-8 text-[#4cd964]" />
                </div>
                <h3 className="text-xl font-bold text-[#0e2e47]">Message Sent!</h3>
                <p className="text-gray-600">Thank you for reaching out. We'll get back to you soon!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" name="firstName" placeholder="Enter your first name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" name="lastName" placeholder="Enter your last name" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="Enter your email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="Enter your phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={topic} onValueChange={setTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="tutoring">Tutoring Services</SelectItem>
                      <SelectItem value="pricing">Pricing Information</SelectItem>
                      <SelectItem value="schedule">Scheduling</SelectItem>
                      <SelectItem value="subjects-info">Subjects Information</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedSubjects.length > 0 && (
                  <div className="space-y-2">
                    <Label>Subjects Selected</Label>
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedSubjects.map((s) => {
                        const Icon = SUBJECT_ICONS[s] || BookOpen
                        return (
                          <span key={s} className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs text-[#0e2e47] bg-white">
                            <Icon className="h-3.5 w-3.5" />
                            {s}
                            <button
                              type="button"
                              aria-label={`Remove ${s}`}
                              onClick={() => setSelectedSubjects((prev) => prev.filter((v) => v !== s))}
                              className="hover:text-[#00a8e8]"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
                {selectedPackage && (
                  <div className="space-y-2">
                    <Label>Selected Package</Label>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs text-[#0e2e47] bg-white">
                        {[selectedPackage.groupName, selectedPackage.tier].filter(Boolean).join(" — ")}
                        <button
                          type="button"
                          aria-label="Remove selected package"
                          onClick={() => setSelectedPackage(null)}
                          className="hover:text-[#00a8e8]"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" placeholder="Enter your message" className="min-h-[120px]" required />
                </div>
                {submitError && <p className="text-sm text-red-500">{submitError}</p>}
                <Button
                  type="submit"
                  className="w-full bg-[#ffbf00] hover:bg-[#ffa500] text-[#0e2e47] font-bold"
                  disabled={isSubmitting}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
