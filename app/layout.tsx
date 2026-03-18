import "./globals.css"
import { ReactNode } from "react"
import { Open_Sans, Plus_Jakarta_Sans } from "next/font/google"
import { NavBar } from "@/components/layout/NavBar"
import { ScrollProgress } from "@/components/layout/ScrollProgress"
import { Footer } from "@/components/layout/Footer"

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
})

export const metadata = {
  title: "HumanWrite",
  description: "Make AI text sound more human and natural.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`gradient-bg ${openSans.variable} ${plusJakartaSans.variable}`}>
        <ScrollProgress />
        <div className="min-h-screen">
          <NavBar />
          <div className="md:grid md:[grid-template-columns:var(--sidebar-w)_1fr]">
            <div className="hidden md:block" />
            <div className="flex min-h-screen flex-col md:min-h-[calc(100vh-5rem)]">
              <main className="page-shell flex-1">{children}</main>
              <Footer />
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
