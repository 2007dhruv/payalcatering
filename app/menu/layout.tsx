import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Catering Menu - Payal Catering Rajkot | Gujarati Thali & More",
    description:
        "Explore Payal Catering's full menu for weddings, functions & events in Rajkot. Authentic Gujarati thali, snacks, sweets, beverages & custom menus. Best catering menu in Saurashtra.",
    keywords: [
        "Payal Catering menu",
        "catering menu Rajkot",
        "Gujarati thali menu",
        "wedding catering menu Rajkot",
        "function catering menu",
        "Saurashtra catering menu",
        "Indian catering menu",
        "vegetarian catering Rajkot",
        "buffet menu Rajkot",
        "catering food items Rajkot",
    ],
    openGraph: {
        title: "Catering Menu - Payal Catering Rajkot | Gujarati Thali & More",
        description:
            "Browse our full food menu for Rajkot weddings & functions. Authentic Gujarati thali, snacks, sweets and custom options.",
        url: "https://payalcatering.com/menu",
    },
    alternates: {
        canonical: "https://payalcatering.com/menu",
    },
}

export default function MenuLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
