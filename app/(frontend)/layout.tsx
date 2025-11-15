import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getFooterContent } from "@/lib/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StudyBuddy Tutors",
  description: "Find your perfect study buddy today!",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const footer = await getFooterContent()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <div className="mt-auto">
            <Footer footer={footer} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}