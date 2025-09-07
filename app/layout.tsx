import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "TimeVault",
  description: "Discover historical events, NASA images, and fun facts from your birthday",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "TimeVault – Discover Your Cosmic Birthday Story",
    description: "See NASA's astronomy picture of the day, historical events, and fun facts from your special date.",
    url: "https://time-vault-iota.vercel.app",
    siteName: "TimeVault",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TimeVault preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TimeVault",
    description: "Discover your birthday in history with NASA images and fun facts.",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
