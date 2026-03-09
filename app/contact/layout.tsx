import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Contact Payal Catering - Book Your Event in Rajkot",
    description:
        "Contact Payal Catering Rajkot to book catering for your wedding, function or event. Call +91 97147 99377 or WhatsApp +91 93136 77629. Serving Rajkot & all of Saurashtra.",
    keywords: [
        "contact Payal Catering",
        "Payal Catering phone number",
        "book catering Rajkot",
        "catering inquiry Rajkot",
        "Rajkot caterer contact",
        "Saurashtra catering booking",
        "Payal Catering address",
        "catering quote Rajkot",
        "hire caterer Rajkot",
        "wedding catering booking Rajkot",
    ],
    openGraph: {
        title: "Contact Payal Catering - Book Your Event in Rajkot",
        description:
            "Get in touch to book Rajkot's best caterer. Call, WhatsApp or fill our inquiry form. Fast response guaranteed.",
        url: "https://payalcatering.com/contact",
    },
    alternates: {
        canonical: "https://payalcatering.com/contact",
    },
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
