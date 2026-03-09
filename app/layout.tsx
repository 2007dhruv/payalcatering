import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://payalcatering.com'),
  title: {
    default: "Payal Catering - Best Catering Services in Rajkot & Saurashtra",
    template: "%s | Payal Catering Rajkot",
  },
  description:
    "Payal Catering — Rajkot's most trusted catering service for weddings, functions & corporate events. 15+ years of authentic Gujarati food excellence across Saurashtra. Call +91 97147 99377.",
  keywords: [
    "Rajkot catering",
    "Rajkot catering service",
    "rajkot catering company",
    "Rajkot function catering",
    "Rajkot function",
    "Saurashtra catering",
    "Saurashtra catering services",
    "Sourashtra catering services",
    "Surashtra catering",
    "Payal",
    "Payal catering",
    "Payal Catering Rajkot",
    "Payal caterer",
    "best catering in Rajkot",
    "top catering Rajkot",
    "wedding catering Rajkot",
    "wedding caterer Rajkot",
    "best caterers in Rajkot",
    "Gujarati thali catering",
    "Gujarati catering",
    "Gujarati wedding catering",
    "corporate event catering Rajkot",
    "corporate event catering Saurashtra",
    "engagement catering Rajkot",
    "birthday catering Rajkot",
    "housewarming catering Rajkot",
    "outdoor catering Rajkot",
    "buffet catering Rajkot",
    "catering services near me Rajkot",
    "best caterer Gujarat",
    "Payal Catering reviews",
    "Mahesh Savaliya catering",
    "Payal catering contact"
  ],
  authors: [{ name: "Payal Catering", url: "https://payalcatering.com" }],
  creator: "Payal Catering",
  publisher: "Payal Catering",
  category: "Catering & Food Services",
  icons: {
    icon: [
      { url: "/images/payal_logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/images/payal_logo.png" },
    ],
    shortcut: "/images/payal_logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://payalcatering.com",
    title: "Payal Catering Rajkot - Best Catering for Weddings & Functions in Saurashtra",
    description: "Rajkot's favourite caterer for weddings, corporate events & all functions. 15+ years of culinary excellence, authentic Gujarati thali & more. Call now!",
    siteName: "Payal Catering",
    images: [
      {
        url: "/images/bg-menu.jpg",
        width: 1200,
        height: 630,
        alt: "Payal Catering - Best Catering Service in Rajkot Saurashtra",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Payal Catering Rajkot | Best Caterer in Saurashtra",
    description: "Authentic Gujarati catering for weddings & all functions in Rajkot & Saurashtra. 15+ years experience.",
    images: ["/images/bg-menu.jpg"],
  },
  alternates: {
    canonical: "https://payalcatering.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "", // Add your Google Search Console verification code here
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  "@id": "https://payalcatering.com",
  name: "Payal Catering",
  alternateName: ["Payal Caterers", "Payal Catering Rajkot"],
  description:
    "Payal Catering is Rajkot's leading catering company providing authentic Gujarati cuisine for weddings, corporate functions, engagements, birthday parties and all celebrations across Saurashtra. 15+ years experience.",
  url: "https://payalcatering.com",
  telephone: ["+91-97147-99377", "+91-93136-77629"],
  email: "info@payalcatering.com",
  foundingDate: "2011",
  image: "https://payalcatering.com/images/bg-menu.jpg",
  logo: "https://payalcatering.com/images/logo.png",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Purusharth Society, Haridhva Road, opp. Balaji Temple",
    addressLocality: "Rajkot",
    addressRegion: "Gujarat",
    postalCode: "360002",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 22.2577881,
    longitude: 70.8085062,
  },
  areaServed: [
    { "@type": "City", name: "Rajkot" },
    { "@type": "State", name: "Saurashtra" },
    { "@type": "State", name: "Gujarat" },
  ],
  servesCuisine: ["Gujarati", "Indian", "North Indian"],
  priceRange: "₹₹",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "10:00",
      closes: "18:00",
    },
  ],
  hasMap: "https://maps.google.com/?cid=rajkot",
  sameAs: [],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "350",
    bestRating: "5",
  },
  keywords:
    "rajkot catering, payal catering, saurashtra catering, rajkot function, best catering rajkot, wedding catering rajkot, gujarati catering",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark bg-[#0f0f11] text-[#e4e4e7]">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
