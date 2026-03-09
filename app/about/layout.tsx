import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "About Payal Catering - 15+ Years of Catering Excellence in Rajkot",
    description:
        "Learn about Payal Catering - Rajkot's most trusted catering company since 2011. Founded by Mahesh Savaliya, we serve authentic Gujarati cuisine for weddings, functions & all events across Saurashtra.",
    keywords: [
        "about Payal Catering",
        "Payal Catering Rajkot",
        "Mahesh Savaliya caterer",
        "best catering company Rajkot",
        "Rajkot catering history",
        "Saurashtra catering company",
        "Gujarati catering services",
        "trusted caterer Rajkot",
        "catering legacy Rajkot",
    ],
    openGraph: {
        title: "About Payal Catering - 15+ Years in Rajkot & Saurashtra",
        description:
            "Serving Rajkot since 2011. 125K+ happy guests, 2000+ weddings catered. Discover our story and team.",
        url: "https://payalcatering.com/about",
    },
    alternates: {
        canonical: "https://payalcatering.com/about",
    },
}

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
