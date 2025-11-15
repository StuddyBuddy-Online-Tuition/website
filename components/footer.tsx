import Image from "next/image"
import Link from "next/link"
import type { Footer as FooterContent } from "@/payload-types"

type FooterProps = {
  footer: FooterContent
}

export default function Footer({ footer }: FooterProps) {
  const brandName = footer?.brandName || "StudyBuddy"
  const description =
    footer?.description ||
    "StudyBuddy is your go-to online tutoring platform. Connect with expert tutors who care about your academic. Learn at your own pace, anytime, anywhere. Find your perfect study buddy today!"
  const facebookUrl = footer?.links?.facebookUrl || "https://www.facebook.com/studybuddysynergy/"
  const email = footer?.links?.email || "admin@studybuddysynergy.com"
  const phone = footer?.links?.phone || "+60124997926"
  const emailHref = email.startsWith("mailto:") ? email : `mailto:${email}`
  const phoneHref = phone.startsWith("tel:") ? phone : `tel:${phone}`

  return (
    <footer className="bg-[#0e2e47] text-white">
      <div className="container px-4 py-8 md:px-6 md:py-10 lg:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex flex-col items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="Study Buddy Logo"
              width={48}
              height={48}
              className="rounded-full bg-white p-1 shadow-md"
            />
            <span className="text-xl font-bold tracking-tight">{brandName}</span>
          </div>
          <p className="mt-2 text-gray-300">{description}</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <a aria-label="Facebook" href={facebookUrl} className="rounded-full bg-white/10 p-2.5 text-white ring-1 ring-white/20 hover:bg-white/20 hover:ring-white/30 transition-colors" target="_blank" rel="noreferrer">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a aria-label="Email" href={emailHref} className="rounded-full bg-white/10 p-2.5 text-white ring-1 ring-white/20 hover:bg-white/20 hover:ring-white/30 transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 6.75A2.75 2.75 0 014.75 4h14.5A2.75 2.75 0 0122 6.75v10.5A2.75 2.75 0 0119.25 20h-14.5A2.75 2.75 0 012 17.25V6.75zm1.77-.51a.75.75 0 00-1.04 1.08l8 7a.75.75 0 00.98 0l8-7a.75.75 0 00-1.04-1.08L12 13.6 3.77 6.24z" />
              </svg>
            </a>
            <a aria-label="Phone" href={phoneHref} className="rounded-full bg-white/10 p-2.5 text-white ring-1 ring-white/20 hover:bg-white/20 hover:ring-white/30 transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.62 10.79a15.054 15.054 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1v3.5a1 1 0 01-1 1C10.85 21 3 13.15 3 3.5a1 1 0 011-1H7.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-6 border-t border-white/10 pt-4 text-center text-gray-300 flex flex-col items-center gap-2 md:flex-row md:justify-between md:text-left">
          <p>© {new Date().getFullYear()} StudyBuddy Synergy Sdn Bhd. All rights reserved.</p>
          <Link
            href="https://www.wanaqim.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-gray-300 hover:text-white underline underline-offset-4"
          >
            Built by Wan Aqim ©
          </Link>
        </div>
      </div>
    </footer>
  )
}