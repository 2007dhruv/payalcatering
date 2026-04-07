import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.payalcatering.in'),
  title: {
    default: "Best Catering Services in Rajkot | Payal Catering",
    template: "%s | Payal Catering",
  },
  description:
    "Payal Catering: Rajkot's trusted caterer for weddings & events. 15+ years of authentic Gujarati food excellence in Saurashtra. Book now!",
  keywords: [
    "Rajkot catering",
    "Rajkot catering service",
    "best catering in Rajkot",
    "wedding catering Rajkot",
    "Saurashtra catering services",
    "Gujarati thali catering",
    "corporate event catering",
    "Payal Catering",
  ],
  authors: [{ name: "Payal Catering", url: "https://www.payalcatering.in" }],
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
    url: "https://www.payalcatering.in",
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
    canonical: "https://www.payalcatering.in",
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
  "@id": "https://www.payalcatering.in",
  name: "Payal Catering",
  alternateName: ["Payal Caterers", "Payal Catering Rajkot"],
  description:
    "Payal Catering is Rajkot's leading catering company providing authentic Gujarati cuisine for weddings, corporate functions, engagements, birthday parties and all celebrations across Saurashtra. 15+ years experience.",
  url: "https://www.payalcatering.in",
  telephone: ["+91-97147-99377", "+91-93136-77629"],
  email: "info@payalcatering.in",
  foundingDate: "2011",
  image: "https://www.payalcatering.in/images/bg-menu.jpg",
  logo: "https://www.payalcatering.in/images/logo.png",
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-13F6PQWF51"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-13F6PQWF51');
          `}
        </Script>
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
