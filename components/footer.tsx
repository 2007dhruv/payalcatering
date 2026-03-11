"use client"

import Link from "next/link"
import { Phone, Mail, MapPin, Globe, Camera } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function Footer() {
  const { t } = useLanguage()

  const quickLinks = [
    { href: "/", label: t("nav_home", "Home", "હોમ") },
    { href: "/menu", label: t("nav_menu", "Our Menu", "મેનુ") },
    { href: "/events", label: t("nav_events", "Events", "ઇવેન્ટ્સ") },
    { href: "/contact", label: t("nav_contact", "Contact", "સંપર્ક") },
  ]

  const services = [
    { label: t("service_wedding", "Wedding Catering", "લગ્ન કેટરિંગ") },
    { label: t("service_corporate", "Corporate Events", "કોર્પોરેટ ઇવેન્ટ્સ") },
    { label: t("service_private", "Private Dining", "ખાનગી ડાઇનિંગ") },
    { label: t("service_destination", "Destination Weddings", "ડેસ્ટિનેશન વેડિંગ્સ") },
  ]

  return (
    <footer className="bg-[#0f0f11] text-gray-400 border-t border-[#27272a]">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Col */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 border border-[#d97706] rounded-full flex items-center justify-center text-[#d97706] font-serif font-bold text-xl">
                P
              </div>
              <h3 className="text-xl text-white font-serif tracking-wide">Payal Catering</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              {t(
                "footer_description",
                "Elevating traditional Gujarati cuisine into a modern luxury experience. We craft memories, one exquisite dish at a time.",
                "પરંપરાગત ગુજરાતી ભોજનનો આધુનિક લક્ઝરી અનુભવ. અમે ઉત્કૃષ્ટ વાનગીઓ સાથે યાદો બનાવીએ છીએ."
              )}
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="/" className="w-8 h-8 rounded-sm bg-[#18181b] border border-[#27272a] flex items-center justify-center hover:bg-[#d97706] hover:text-black hover:border-[#d97706] transition-all">
                <Globe className="h-4 w-4" />
              </a>
              <a href="/events" className="w-8 h-8 rounded-sm bg-[#18181b] border border-[#27272a] flex items-center justify-center hover:bg-[#d97706] hover:text-black hover:border-[#d97706] transition-all">
                <Camera className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 flex items-center">
              <span className="w-1 h-4 bg-[#d97706] mr-3 rounded-sm"></span>
              {t("footer_quick_links", "Quick Links", "ઝડપી લિંક્સ")}
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-[#d97706] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-6 flex items-center">
              <span className="w-1 h-4 bg-[#d97706] mr-3 rounded-sm"></span>
              {t("footer_services", "Services", "અમારી સેવાઓ")}
            </h4>
            <ul className="space-y-4">
              {services.map((service, index) => (
                <li key={index} className="text-sm hover:text-[#d97706] transition-colors cursor-pointer">
                  {service.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-white font-semibold mb-6 flex items-center">
              <span className="w-1 h-4 bg-[#d97706] mr-3 rounded-sm"></span>
              {t("footer_contact", "Contact", "સંપર્ક માહિતી")}
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-[#d97706] mt-0.5" />
                <div className="space-y-1">
                  <p>+91 97147 99377</p>
                  <p>+91 93136 77629</p>
                </div>
              </div>
              {/* <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-[#d97706] mt-0.5" />
                <p>info@payalcatering.com</p>
              </div> */}
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-[#d97706] mt-0.5" />
                <p className="leading-relaxed">
                  {t(
                    "footer_address",
                    "Rajkot, Gujarat - 360002",
                    "રાજકોટ, ગુજરાત - 360002"
                  )}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#27272a] mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>
            © 2026 Payal Catering. Luxury Redefined.
          </p>
          {/* <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div> */}
        </div>
      </div>
    </footer>
  )
}
