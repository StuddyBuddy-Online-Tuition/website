"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Study Buddy Logo" width={50} height={50} className="rounded-full" />
          <span className="text-xl font-bold text-[#0e2e47]">StudyBuddy Tutors</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/#about" className="text-[#0e2e47] hover:text-[#00a8e8] font-medium transition-colors">
            About
          </Link>
          <Link href="/#why-us" className="text-[#0e2e47] hover:text-[#00a8e8] font-medium transition-colors">
            Why Us
          </Link>
          <Link href="/#teachers" className="text-[#0e2e47] hover:text-[#00a8e8] font-medium transition-colors">
            Teachers
          </Link>
          <Link href="/#subjects" className="text-[#0e2e47] hover:text-[#00a8e8] font-medium transition-colors">
            Subjects
          </Link>
          <Link href="/#contact" className="text-[#0e2e47] hover:text-[#00a8e8] font-medium transition-colors">
            Contact
          </Link>
          <Link href="/timetable" className="text-[#0e2e47] hover:text-[#00a8e8] font-medium transition-colors">
            Timetable
          </Link>
        </nav>
        <div className="hidden md:flex">
          <Button asChild className="bg-[#ffbf00] hover:bg-[#ffa500] text-[#0e2e47] font-bold">
            <Link href="/register">Register Now!</Link>
          </Button>
        </div>
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white p-4 border-t">
          <nav className="flex flex-col gap-4">
            <Link
              href="/#about"
              className="text-[#0e2e47] hover:text-[#00a8e8] font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/#why-us"
              className="text-[#0e2e47] hover:text-[#00a8e8] font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Why Us
            </Link>
            <Link
              href="/#teachers"
              className="text-[#0e2e47] hover:text-[#00a8e8] font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Teachers
            </Link>
            <Link
              href="/#subjects"
              className="text-[#0e2e47] hover:text-[#00a8e8] font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Subjects
            </Link>
            <Link
              href="/#contact"
              className="text-[#0e2e47] hover:text-[#00a8e8] font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/timetable"
              className="text-[#0e2e47] hover:text-[#00a8e8] font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Timetable
            </Link>
            <Button asChild className="bg-[#ffbf00] hover:bg-[#ffa500] text-[#0e2e47] font-bold w-full">
              <Link href="/register">Register Now!</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
