"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Star,
  Users,
  Calendar,
  ChefHat,
  Heart,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Home,
  Cake,
  PartyPopper,
  Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { getFeaturedEventsAction } from "@/app/actions"
import CountUp from "@/components/count-up"
import { SplitText } from "@/components/react-bits/SplitText"
import { ShinyText } from "@/components/react-bits/ShinyText"
import { StarBorder } from "@/components/react-bits/StarBorder"
import { SpotlightCard } from "@/components/react-bits/SpotlightCard"
import { TiltedCard } from "@/components/react-bits/TiltedCard"
import { Great_Vibes } from "next/font/google"

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
})

import { ChevronDown, ChevronUp } from "lucide-react"

export default function HomePage() {
  const { t } = useLanguage()
  const [featuredEvents, setFeaturedEvents] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isSeoExpanded, setIsSeoExpanded] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    fetchFeaturedEvents()

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(testimonialInterval)
  }, [])

  const fetchFeaturedEvents = async () => {
    const { data } = await getFeaturedEventsAction()
    if (data) setFeaturedEvents(data)
  }

  const services = [
    {
      icon: Heart,
      title: t("service_wedding", "Weddings", "લગ્ન"),
      description: t(
        "service_wedding_desc",
        "Traditional ceremonies with authentic flavors",
        "પરંપરાગત સમારોહ અસલી સ્વાદ સાથે",
      ),
      image: "/images/services/wedding.png"
    },
    {
      icon: Sparkles,
      title: t("service_engagement", "Engagements", "સગાઈ"),
      description: t("service_engagement_desc", "Celebrate love with exquisite dining", "ઉત્કૃષ્ટ ભોજન સાથે પ્રેમની ઉજવણી"),
      image: "/images/services/engagement.png"
    },
    {
      icon: Home,
      title: t("service_housewarming", "Housewarming", "ગૃહપ્રવેશ"),
      description: t(
        "service_housewarming_desc",
        "Bless your new home with delicious food",
        "સ્વાદિષ્ટ ભોજન સાથે તમારા નવા ઘરને આશીર્વાદ આપો",
      ),
      image: "/images/services/housewarming.png"
    },
    {
      icon: Briefcase,
      title: t("service_corporate", "Corporate Events", "કોર્પોરેટ ઇવેન્ટ્સ"),
      description: t(
        "service_corporate_desc",
        "Professional catering for business occasions",
        "વ્યવસયિક પ્રસંગો માટે વ્યાવસાયિક કેટરિંગ",
      ),
      image: "/images/services/corporate.png"
    },
    {
      icon: Cake,
      title: t("service_birthday", "Birthday Parties", "જન્મદિવસ પાર્ટીઓ"),
      description: t(
        "service_birthday_desc",
        "Make birthdays memorable with great food",
        "મહાન ભોજન સાથે જન્મદિવસને યાદગાર બનાવો",
      ),
      image: "/images/services/birthday.png"
    },
    {
      icon: PartyPopper,
      title: t("service_other", "Other Events", "અન્ય કાર્યક્રમો"),
      description: t("service_other_desc", "Any celebration, we make it special", "કોઈપણ ઉત્સવ, અમે તેને ખાસ બનાવીએ છીએ"),
      image: "/images/services/other.png"
    },
  ]

  const testimonials = [
    {
      name: t("testimonial_3_name", "Kiran Desai", "કિરણ દેસાઈ"),
      event: t("testimonial_3_event", "Corporate Event", "કોર્પોરેટ ઇવેન્ટ"),
      quote: t(
        "testimonial_3_quote",
        "Professional service and delicious food. Highly recommended!",
        "વ્યાવસાયિક સેવા અને સ્વાદિષ્ટ ખોરાક. ખૂબ ભલામણ!",
      ),
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: t("testimonial_1_name", "Rajubhai Patel", "રાજુભાઈ પટેલ"),
      event: t("testimonial_1_event", "Wedding", "લગ્ન"),
      quote: t(
        "testimonial_1_quote",
        "Unexpected crowd… handled smoothly… food was excellent!",
        "અનપેક્ષિત ભીડ... સરળતાથી સંભાળી... ખોરાક ઉત્કૃષ્ટ હતો!",
      ),
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: t("testimonial_2_name", "Priyaben Shah", "પ્રિયાબેન શાહ"),
      event: t("testimonial_2_event", "Engagement", "સગાઈ"),
      quote: t(
        "testimonial_2_quote",
        "Amazing taste and presentation. Everyone loved the food!",
        "અદ્ભુત સ્વાદ અને પ્રસ્તુતિ. બધાને ખોરાક ગમ્યો!",
      ),
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  const stats = [
    {
      icon: Calendar,
      value: 15,
      label: t("stat_years", "Years", "વર્ષ"),
      suffix: "+",
    },
    {
      icon: Heart,
      value: 2000,
      label: t("stat_weddings", "Weddings", "લગ્ન"),
      suffix: "+",
    },
    {
      icon: Users,
      value: 125,
      label: t("stat_guests", "Guests", "મહેમાનો"),
      suffix: "K+",
    },
    {
      icon: ChefHat,
      value: 340,
      label: t("stat_staff", "Staff", "સ્ટાફ"),
      suffix: "+",
    },
    {
      icon: Star,
      value: 98,
      label: t("stat_repeat", "Repeat Clients", "પુનરાવર્તિત ગ્રાહકો"),
      suffix: "%",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0f0f11] font-sans text-gray-200 selection:bg-[#d97706]/30">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0f0f11]">

        {/* Dark Luxury Gradient Orbs */}
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-[#d97706] rounded-full filter blur-[100px] opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-[15%] w-80 h-80 bg-[#b45309] rounded-full filter blur-[120px] opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-[40%] w-72 h-72 bg-[#f59e0b] rounded-full filter blur-[100px] opacity-10 animate-blob animation-delay-4000"></div>

        {/* Traditional Pattern Underlay */}
        <div
          className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none"
          style={{ backgroundImage: `url('/images/pattern-bg.png')`, backgroundSize: '400px' }}
        />

        <div
          className={`relative z-20 text-center px-4 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
        >
          {/* Greeting */}
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-6 w-6 text-[#d97706] mr-3" />
            <h2 className="text-xl md:text-2xl font-serif font-medium tracking-[0.2em]">
              <ShinyText text={t("hero_greeting", "Jay Shree Krishna!", "જય શ્રી કૃષ્ણ!")} speed={3} />
            </h2>
            <Sparkles className="h-6 w-6 text-[#d97706] ml-3" />
          </div>

          <h1
            className={`text-6xl md:text-8xl lg:text-9xl mb-6 p-4 text-[#d97706] drop-shadow-sm ${greatVibes.className}`}
          >
            <SplitText text={t("hero_title", "Payal Catering", "પાયલ કેટરિંગ")} delay={0.2} stagger={0.15} />
          </h1>

          <p className="text-lg md:text-xl mb-12 font-light text-gray-400 max-w-3xl mx-auto leading-relaxed tracking-wide">
            {t(
              "hero_subtitle",
              "Delicious Food, Joyful Vibes — Saurashtra's Favorite Caterer for Every Occasion",
              "સ્વાદિષ્ટ ખોરાક, આનંદદાયક વાતાવરણ — દરેક પ્રસંગ માટે સૌરાષ્ટ્રનું મનપસંદ કેટરર",
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-8">
            <Button
              asChild
              className="bg-[#d97706] hover:bg-[#b45309] text-black font-semibold tracking-wider uppercase px-10 py-6 text-sm rounded-sm shadow-xl shadow-[#d97706]/10 hover:shadow-[#d97706]/20 transition-all duration-300"
            >
              <Link href="/contact" className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                {t("hero_book_event", "Book Your Event", "તમારો કાર્યક્રમ બુક કરો")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border border-[#404040] text-gray-300 hover:border-[#d97706] hover:text-[#d97706] hover:bg-transparent font-semibold tracking-wider uppercase px-10 py-6 text-sm rounded-sm transition-all duration-300 bg-[#18181b]/50 backdrop-blur-sm"
            >
              <Link href="/menu" className="flex items-center">
                <ChefHat className="mr-2 h-4 w-4" />
                {t("hero_view_menu", "View Menu", "મેનુ જુઓ")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About/Excellence Section */}
      <section className="py-24 bg-[#18181b] relative border-y border-[#27272a]">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Image Side */}
            <div className={`transform transition-all duration-1000 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"} flex justify-center`}>
              <div className="relative group w-full max-w-[500px] aspect-[4/3] rounded-sm lg:scale-110">
                <TiltedCard
                  imageSrc="/images/bg-menu.jpg"
                  altText="Traditional Gujarati Thali"
                  containerHeight="100%"
                  containerWidth="100%"
                  imageHeight="100%"
                  imageWidth="100%"
                  rotateAmplitude={12}
                  scaleOnHover={1.05}
                  displayOverlayContent={true}
                  showTooltip={false}
                  overlayContent={
                    <div className="text-white text-center">
                      <div className="text-4xl md:text-5xl font-bold font-serif mb-1 text-[#d97706] drop-shadow-md">15+</div>
                      <div className="text-sm md:text-xs font-semibold tracking-[0.2em] uppercase text-gray-200 drop-shadow-md">
                        {t("years_experience", "Years of Experience", "વર્ષોનો અનુભવ")}
                      </div>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Text Side */}
            <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}>
              <h2 className="text-4xl md:text-5xl lg:text-5xl font-serif font-bold text-white mb-8 leading-tight">
                <SplitText text={t("about_heading", "15+ Years of Culinary Excellence", "15+ વર્ષની રસોઈ શ્રેષ્ઠતા")} delay={0.1} stagger={0.05} />
              </h2>
              <div className="space-y-8 text-lg text-gray-400 font-light leading-relaxed">
                <p>
                  {t(
                    "about_text",
                    "Since 2011, we've served over 125,000 happy guests. Our 98% repeat client rate speaks volumes about our quality and trust. We believe in creating memories through the authentic taste of tradition mixed with luxury.",
                    "2011 થી, અમે 125,000 થી વધુ ખુશ મહેમાનોની સેવા કરી છે. અમારો 98% પુનરાવર્તિત ગ્રાહક દર અમારી ગુણવત્તા અને વિશ્વાસ વિશે ઘણું કહે છે."
                  )}
                </p>
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#27272a]">
                  <div>
                    <div className="text-3xl font-bold text-white mb-2 font-serif">
                      <CountUp to={125} separator="," className="inline-block" />,000+
                    </div>
                    <div className="text-[10px] text-[#d97706] font-bold tracking-[0.2em] uppercase">
                      {t("happy_guests", "Happy Guests", "ખુશ મહેમાનો")}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-2 font-serif">
                      <CountUp to={98} />%
                    </div>
                    <div className="text-[10px] text-[#d97706] font-bold tracking-[0.2em] uppercase">
                      {t("repeat_clients", "Repeat Clients", "પુનરાવર્તિત ગ્રાહકો")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-[#0f0f11]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              <SplitText text={t("services_heading", "We Cater To All Celebrations", "અમે બધી ઉજવણીઓ માટે કેટરિંગ કરીએ છીએ")} delay={0.1} stagger={0.05} />
            </h2>
            <p className="text-lg text-gray-500 font-light">
              {t(
                "services_description",
                "From intimate gatherings to grand celebrations, we bring authentic flavors to every occasion.",
                "ઘનિષ્ઠ મેળાવડાથી લઈને ભવ્ય ઉત્સવો સુધી, અમે દરેક પ્રસંગમાં અસલી સ્વાદ લાવીએ છીએ."
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <SpotlightCard
                key={index}
                className="group p-0 rounded-sm bg-[#18181b] border-[#27272a] hover:border-[#d97706]/50 transition-all duration-500 transform hover:-translate-y-2 shadow-xl"
                spotlightColor="rgba(217, 119, 6, 0.2)"
              >
                <Card className="bg-transparent border-0 h-full overflow-hidden">
                  <CardContent className="p-10 text-center relative h-full flex flex-col items-center">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d97706] to-[#fbbf24] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />

                    <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0f0f11] border border-[#27272a] text-gray-400 rounded-full mb-8 group-hover:border-[#d97706] group-hover:text-[#d97706] transition-colors duration-500 relative z-10 hover:scale-110">
                      <service.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-serif text-white mb-4 tracking-wide relative z-10">{service.title}</h3>
                    <p className="text-gray-500 font-light leading-relaxed text-sm relative z-10">{service.description}</p>
                  </CardContent>
                </Card>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-[#18181b] border-y border-[#27272a] relative overflow-hidden">
        {/* Decorative Quote Mark */}
        <div className="absolute top-10 left-10 md:left-24 text-[200px] text-white/[0.02] font-serif leading-none select-none pointer-events-none">"</div>

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">
              <SplitText text={t("testimonials_heading", "What Our Clients Say", "અમારા ગ્રાહકો શું કહે છે")} delay={0.1} stagger={0.05} />
            </h2>
          </div>

          <div className="relative overflow-hidden rounded-sm bg-[#0f0f11] shadow-2xl border border-[#27272a] mx-auto max-w-4xl p-2 md:p-4">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="px-8 py-12 md:py-16 md:px-20 text-center flex flex-col items-center justify-center h-full">
                    <div className="w-16 h-16 bg-[#18181b] border border-[#d97706]/50 rounded-full mb-8 flex items-center justify-center text-[#d97706] font-serif text-2xl font-bold shadow-lg shadow-[#d97706]/10">
                      {testimonial.name.charAt(0)}
                    </div>
                    <blockquote className="text-xl md:text-3xl font-serif italic text-gray-300 mb-10 leading-relaxed font-light">
                      "{testimonial.quote}"
                    </blockquote>
                    <div>
                      <div className="font-bold text-sm text-white tracking-[0.2em] uppercase">{testimonial.name}</div>
                      <div className="text-[#d97706] text-xs font-semibold tracking-wide uppercase mt-2">{testimonial.event}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-10 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentTestimonial ? "bg-[#d97706] w-6" : "bg-gray-700 hover:bg-gray-500"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="py-20 bg-[#0f0f11] relative border-b border-[#27272a]">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-10">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#18181b] border border-[#27272a] rounded-full mb-6 transform group-hover:scale-110 group-hover:border-[#d97706] transition-all duration-500">
                  <stat.icon className="h-6 w-6 text-[#d97706]" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-serif">
                  <CountUp to={stat.value} separator="," className="inline-block" />
                  <span className="text-[#d97706]">{stat.suffix}</span>
                </div>
                <div className="text-gray-500 font-semibold tracking-[0.2em] uppercase text-[10px] md:text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-[#0f0f11]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              {t("contact_heading", "Ready to Celebrate?", "ઉજવણી કરવા તૈયાર છો?")}
            </h2>
            <p className="text-xl text-gray-500 font-light">
              {t("contact_subheading", "Let's make your event unforgettable.", "ચાલો તમારા કાર્યક્રમને અવિસ્મરણીય બનાવીએ.")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Get In Touch Card */}
            <Card className="bg-[#18181b] rounded-sm shadow-2xl border border-[#27272a] overflow-hidden">
              <CardContent className="p-10 lg:p-12">
                <div className="flex items-center mb-8">
                  <span className="w-6 h-[1px] bg-[#d97706] mr-4"></span>
                  <h3 className="text-xl font-serif font-medium text-white tracking-widest uppercase">
                    <ShinyText text={t("contact_info", "Get In Touch", "સંપર્કમાં રહો")} speed={3} />
                  </h3>
                </div>
                <div className="space-y-8">
                  <div className="flex items-center space-x-6 group cursor-pointer">
                    <div className="w-12 h-12 bg-[#0f0f11] border border-[#27272a] rounded-full flex items-center justify-center group-hover:border-[#d97706] transition-colors duration-300 text-gray-400 group-hover:text-[#d97706]">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-white">+91 97147 99377</div>
                      <div className="text-gray-500 text-xs font-semibold tracking-wider uppercase mt-1">Call us anytime</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 group cursor-pointer">
                    <div className="w-12 h-12 bg-[#0f0f11] border border-[#27272a] rounded-full flex items-center justify-center group-hover:border-[#d97706] transition-colors duration-300 text-gray-400 group-hover:text-[#d97706]">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-white">+91 93136 77629</div>
                      <div className="text-gray-500 text-xs font-semibold tracking-wider uppercase mt-1">WhatsApp us</div>
                    </div>
                  </div>

                  {/* <div className="flex items-center space-x-6 group cursor-pointer">
                    <div className="w-12 h-12 bg-[#0f0f11] border border-[#27272a] rounded-full flex items-center justify-center group-hover:border-[#d97706] transition-colors duration-300 text-gray-400 group-hover:text-[#d97706]">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-white">info@payalcatering.com</div>
                      <div className="text-gray-500 text-xs font-semibold tracking-wider uppercase mt-1">Email us</div>
                    </div>
                  </div> */}

                  <div className="flex flex-col space-y-3 pt-6 border-t border-[#27272a]">
                    <div className="flex items-start space-x-6">
                      <div className="w-12 h-12 bg-[#0f0f11] border border-[#27272a] rounded-full flex items-center justify-center shrink-0 text-[#d97706]">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-300 leading-relaxed text-sm">
                          {t("address", "Purusharth Society, Haridhva Road, opp. Balaji Temple, Rajkot-360002", "પુરુષાર્થ સોસાયટી, હરિધ્વા રોડ, બાલાજી મંદિર સામે, રાજકોટ-360002")}
                        </div>
                        <div className="text-gray-500 text-xs font-semibold tracking-wider uppercase mt-2">Visit our location</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Book Card */}
            <StarBorder color="#d97706" speed="4s">
              <Card className="bg-[#18181b] rounded-sm shadow-2xl border-0 overflow-hidden relative h-full">
                {/* Gold gradient glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d97706] rounded-full filter blur-[100px] opacity-10 pointer-events-none -mr-20 -mt-20"></div>

                <CardContent className="p-10 lg:p-12 h-full flex flex-col justify-center relative z-10">
                  <div className="inline-block mb-6">
                    <span className="text-[10px] text-[#d97706] border border-[#d97706] px-3 py-1 font-semibold tracking-widest uppercase rounded-sm">
                      <ShinyText text="Inquire Now" speed={3} />
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-white leading-tight">
                    {t("cta_heading", "Book Your Event Today!", "આજે જ તમારો કાર્યક્રમ બુક કરો!")}
                  </h3>
                  <p className="mb-10 text-gray-400 text-base font-light leading-relaxed">
                    {t(
                      "cta_text",
                      "From traditional Gujarati thalis to modern fusion cuisine, we create memorable dining experiences for every celebration.",
                      "પરંપરાગત ગુજરાતી થાળીથી લઈને આધુનિક ફ્યુઝન ભોજન સુધી..."
                    )}
                  </p>
                  <Button
                    asChild
                    className="bg-[#d97706] hover:bg-[#b45309] text-black font-semibold uppercase tracking-wider px-8 py-6 text-sm rounded-sm shadow-xl transition-all duration-300 w-full md:w-auto"
                  >
                    <Link href="/contact" className="flex items-center justify-center">
                      {t("contact_button", "Contact Us Now", "હવે અમારો સંપર્ક કરો")}
                      <ArrowRight className="ml-3 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </StarBorder>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section
        aria-label="About Payal Catering Services"
        className="container mx-auto px-4 max-w-5xl py-12 text-gray-500 text-sm font-light border-t border-[#27272a]"
      >
        <div className="flex items-center justify-between cursor-pointer group" onClick={() => setIsSeoExpanded(!isSeoExpanded)}>
          <h2 className="text-xl font-serif font-medium text-gray-400 group-hover:text-[#d97706] transition-colors">
            Payal Catering - Best Catering Services in Rajkot
          </h2>
          <Button variant="ghost" size="sm" className="text-gray-500 group-hover:text-[#d97706]">
            {isSeoExpanded ? (
              <span className="flex items-center">Read Less <ChevronUp className="ml-2 h-4 w-4" /></span>
            ) : (
              <span className="flex items-center">Read More <ChevronDown className="ml-2 h-4 w-4" /></span>
            )}
          </Button>
        </div>

        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isSeoExpanded ? "max-h-[2000px] opacity-100 mt-8" : "max-h-0 opacity-0"}`}>
          <p className="mb-6 leading-relaxed">
            Payal Catering is the best catering service in Rajkot, Gujarat. We are a leading catering
            company providing authentic Gujarati cuisine and professional catering solutions for all types
            of functions and celebrations in Rajkot and across Saurashtra. Whether you are looking for
            Rajkot catering for a wedding, a Rajkot function caterer for a corporate event, or Saurashtra
            catering services for any special occasion, Payal Catering is your first choice.
          </p>
          <h3 className="text-lg font-serif font-medium text-gray-300 mb-3 mt-8">Payal Catering Rajkot - Your Trusted Caterer</h3>
          <p className="mb-6 leading-relaxed">
            Payal Catering, founded by Mahesh Savaliya, has been the most trusted catering name in Rajkot
            since 2011. With 15+ years of experience in Rajkot catering, we have served over 125,000
            happy guests and catered 2,000+ weddings across Saurashtra. Our 98% repeat client rate makes
            us Rajkot&apos;s number one catering company. Search "Payal catering", "Payal Catering Rajkot",
            or "best catering in Rajkot" and you will find us at the top.
          </p>
          <h3 className="text-lg font-serif font-medium text-gray-300 mb-3 mt-8">Catering Services We Offer in Rajkot</h3>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>Wedding Catering Rajkot - Best wedding caterers in Rajkot and Saurashtra</li>
            <li>Rajkot Function Catering - All types of functions and ceremonies</li>
            <li>Corporate Event Catering Rajkot and Saurashtra</li>
            <li>Engagement Catering Rajkot</li>
            <li>Birthday Party Catering Rajkot</li>
            <li>Housewarming (Griha Pravesh) Catering Rajkot</li>
            <li>Outdoor Catering Rajkot</li>
            <li>Buffet Catering Rajkot</li>
            <li>Gujarati Thali Catering Rajkot</li>
          </ul>
          <h3 className="text-lg font-serif font-medium text-gray-300 mb-3 mt-8">Saurashtra Catering Services</h3>
          <p className="mb-6 leading-relaxed">
            As the top Saurashtra catering services provider, Payal Catering brings the rich traditions
            of Sourashtra catering services to every event. Our Surashtra catering expertise covers all
            of Gujarat including Rajkot, Jamnagar, Junagadh, Bhavnagar, and surrounding districts.
            Payal caterers bring authentic Gujarati taste to your doorstep.
          </p>
          <h3 className="text-lg font-serif font-medium text-gray-300 mb-3 mt-8">Contact Payal Catering Now</h3>
          <p className="mb-2 leading-relaxed">
            To book Rajkot catering services, contact Payal Catering at +91 97147 99377 or WhatsApp
            +91 93136 77629. Our office is at Purusharth Society, Haridhva Road, opp. Balaji Temple,
            Rajkot - 360002. Email: info@payalcatering.com. Get a free catering quote for your Rajkot
            function or Saurashtra event today!
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
