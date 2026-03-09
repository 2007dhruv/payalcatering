"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Phone, Mail, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: t("nav_home", "Home", "હોમ") },
    { href: "/menu", label: t("nav_menu", "Menu", "મેનુ") },
    { href: "/events", label: t("nav_events", "Events", "ઇવેન્ટ્સ") },
    { href: "/about", label: t("nav_about", "About", "અમારા વિશે") },
  ]

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#0f0f11] text-[#d97706] py-2 px-6 hidden md:block border-b border-[#27272a]">
        <div className="container mx-auto flex justify-between items-center text-xs tracking-wider">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-3 w-3" />
              <span>+91 97147 99377</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-3 w-3" />
              <span>info@payalcatering.com</span>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setLanguage(language === "en" ? "gu" : "en")}
              className="flex items-center space-x-2 hover:text-white transition-colors"
            >
              <Globe className="h-3 w-3" />
              <span className="uppercase">{language === "en" ? "ગુજરાતી" : "English"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-[#0f0f11]/95 backdrop-blur-md shadow-lg shadow-black/50" : "bg-[#18181b]"
          }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center group">
              <div className=" rounded-xl px-4 py-2 shadow-lg shadow-black/40 transition-transform duration-200 group-hover:scale-105">
                <Image
                  src="/images/payal_logo.png"
                  alt="Payal Catering Service Logo"
                  height={52}
                  width={170}
                  className="h-[52px] w-auto object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold tracking-[0.1em]">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-2 uppercase transition-colors duration-200 ${pathname === item.href ? "text-[#d97706]" : "text-gray-400 hover:text-white"
                    }`}
                >
                  {item.label}
                  {pathname === item.href && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d97706] rounded-full" />
                  )}
                </Link>
              ))}
              <Link
                href="/contact"
                className="border border-[#d97706] text-[#d97706] px-6 py-2 hover:bg-[#d97706] hover:text-black transition-colors uppercase tracking-[0.1em]"
              >
                {t("nav_contact", "Contact", "સંપર્ક")}
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#18181b] border-t border-[#27272a] shadow-lg">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-3 px-4 rounded-lg transition-colors duration-200 uppercase tracking-widest text-xs font-semibold ${pathname === item.href
                    ? "bg-[#27272a] text-[#d97706]"
                    : "text-gray-400 hover:bg-[#27272a] hover:text-white"
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="block text-center mt-2 py-3 px-4 rounded-lg border border-[#d97706] text-[#d97706] hover:bg-[#d97706] hover:text-black uppercase tracking-widest text-xs font-semibold"
              >
                {t("nav_contact", "Contact", "સંપર્ક")}
              </Link>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  setLanguage(language === "en" ? "gu" : "en")
                  setIsMenuOpen(false)
                }}
                className="w-full justify-start text-gray-400 hover:bg-[#27272a] hover:text-white uppercase tracking-widest text-xs font-semibold mt-2"
              >
                <Globe className="h-4 w-4 mr-2" />
                {language === "en" ? "ગુજરાતી" : "English"}
              </Button>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
