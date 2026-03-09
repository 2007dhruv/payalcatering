"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Award, Users, Heart, Star, ChefHat, Clock, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import CountUp from "@/components/count-up"
import { SpotlightCard } from "@/components/react-bits/SpotlightCard"
import { MagneticHover } from "@/components/react-bits/MagneticHover"

export default function AboutPage() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const values = [
    {
      icon: Heart,
      title: t("value_quality", "Quality First", "ગુણવત્તા પ્રથમ"),
      description: t(
        "value_quality_desc",
        "We use only the finest ingredients and traditional cooking methods",
        "અમે ફક્ત શ્રેષ્ઠ ઘટકો અને પરંપરાગત રસોઈ પદ્ધતિઓનો ઉપયોગ કરીએ છીએ",
      ),
    },
    {
      icon: Users,
      title: t("value_service", "Exceptional Service", "અસાધારણ સેવા"),
      description: t(
        "value_service_desc",
        "Our dedicated team ensures every event is perfectly executed",
        "અમારી સમર્પિત ટીમ ખાતરી કરે છે કે દરેક કાર્યક્રમ સંપૂર્ણ રીતે અમલમાં મૂકાય",
      ),
    },
    {
      icon: ChefHat,
      title: t("value_tradition", "Traditional Recipes", "પરંપરાગત વાનગીઓ"),
      description: t(
        "value_tradition_desc",
        "Authentic flavors passed down through generations",
        "પેઢીઓથી ચાલતા અસલી સ્વાદો",
      ),
    },
    {
      icon: Clock,
      title: t("value_reliability", "Reliable & Timely", "વિશ્વસનીય અને સમયસર"),
      description: t(
        "value_reliability_desc",
        "We deliver on time, every time, without compromising quality",
        "અમે ગુણવત્તામાં સમાધાન કર્યા વિના, દર વખતે સમયસર ડિલિવરી કરીએ છીએ",
      ),
    },
  ]

  const stats = [
    { icon: Users, value: 500, label: t("stat_events", "Events Catered", "કેટર કરેલા ઇવેન્ટ્સ"), suffix: "+" },
    { icon: Star, value: 9, label: t("stat_rating", "Customer Rating", "ગ્રાહક રેટિંગ"), suffix: "" },
    { icon: Award, value: 15, label: t("stat_experience", "Years Experience", "વર્ષોનો અનુભવ"), suffix: "+" },
    { icon: Heart, value: 1000, label: t("stat_customers", "Happy Customers", "ખુશ ગ્રાહકો"), suffix: "+" },
  ]

  return (
    <div className="min-h-screen bg-[#0f0f11] text-gray-200">
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden bg-[#0f0f11]">
        {/* Dark Luxury Gradient Orbs */}
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-[#d97706] rounded-full filter blur-[100px] opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-[15%] w-80 h-80 bg-[#b45309] rounded-full filter blur-[120px] opacity-10 animate-blob animation-delay-2000"></div>

        {/* Traditional Pattern Underlay */}
        <div
          className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none"
          style={{ backgroundImage: `url('/images/pattern-bg.png')`, backgroundSize: '400px' }}
        />

        <div className="relative z-20 text-center px-4">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-5 w-5 text-[#d97706] mr-3" />
            <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-[#d97706]">
              {t("about_greeting", "Craftsmanship & Legacy", "કારીગરી અને વારસો")}
            </h2>
            <Sparkles className="h-5 w-5 text-[#d97706] ml-3" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-white">
            {t("about_title", "About Us", "અમારા વિશે")}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto font-light text-gray-400 tracking-wide">
            {t(
              "about_subtitle",
              "Crafting culinary experiences with passion and tradition",
              "જુસ્સા અને પરંપરા સાથે રસોઈના અનુભવો બનાવવા",
            )}
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-[#0f0f11] relative border-y border-[#27272a]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              className={`transform transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                }`}
            >
              <div className="inline-block mb-6">
                <span className="text-[10px] text-[#d97706] border border-[#d97706] px-3 py-1 font-semibold tracking-widest uppercase rounded-sm">
                  Our Legacy
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">
                {t("our_story_title", "Our Story", "અમારી વાર્તા")}
              </h2>
              <div className="space-y-6 text-lg text-gray-400 font-light leading-relaxed">
                <p>
                  {t(
                    "story_para1",
                    "Founded with a passion for authentic Gujarati cuisine, Payal Catering has been serving delicious, traditional food for over a decade. What started as a small family business has grown into one of the most trusted catering services in Gujarat.",
                    "અસલી ગુજરાતી ભોજનના જુસ્સા સાથે સ્થાપિત, પાયલ કેટરિંગ એક દાયકાથી વધુ સમયથી સ્વાદિષ્ટ, પરંપરાગત ભોજન પીરસી રહ્યું છે. જે એક નાના કુટુંબના વ્યવસાય તરીકે શરૂ થયું હતું તે ગુજરાતની સૌથી વિશ્વસનીય કેટરિંગ સેવાઓમાંની એક બની ગયું છે.",
                  )}
                </p>
                <p>
                  {t(
                    "story_para2",
                    "Our commitment to quality, authenticity, and exceptional service has made us the preferred choice for weddings, corporate events, and special celebrations. We take pride in preserving traditional recipes while adapting to modern tastes and dietary preferences.",
                    "ગુણવત્તા, અધિકૃતતા અને અસાધારણ સેવા પ્રત્યેની અમારી પ્રતિબદ્ધતાએ અમને લગ્ન, કોર્પોરેટ ઇવેન્ટ્સ અને ખાસ ઉત્સવો માટે પસંદગીની પસંદગી બનાવી છે. અમે આધુનિક સ્વાદ અને આહાર પસંદગીઓને અનુકૂલિત કરતી વખતે પરંપરાગત વાનગીઓને સાચવવામાં ગર્વ અનુભવીએ છીએ.",
                  )}
                </p>
                <p>
                  {t(
                    "story_para3",
                    "Every dish we prepare is made with love, using the finest ingredients and time-honored cooking techniques. Our experienced chefs and dedicated staff work tirelessly to ensure that every event we cater becomes a memorable celebration.",
                    "અમે જે દરેક વાનગી તૈયાર કરીએ છીએ તે પ્રેમથી બનાવવામાં આવે છે, શ્રેષ્ઠ ઘટકો અને સમય-સન્માનિત રસોઈ તકનીકોનો ઉપયોગ કરીને. અમારા અનુભવી રસોઈયા અને સમર્પિત સ્ટાફ એ સુનિશ્ચિત કરવા માટે અથાક મહેનત કરે છે કે અમે જે દરેક કાર્યક્રમ કેટર કરીએ છીએ તે એક યાદગાર ઉજવણી બને.",
                  )}
                </p>
              </div>
            </div>
            <div
              className={`transform transition-all duration-1000 delay-300 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
                }`}
            >
              <div className="relative group w-full max-w-[500px] aspect-[4/3] rounded-sm lg:scale-105">
                <SpotlightCard
                  className="w-full h-full p-0 overflow-hidden rounded-sm bg-[#18181b] border-[#27272a] shadow-2xl"
                  spotlightColor="rgba(217, 119, 6, 0.2)"
                >
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src="/images/site-image.jpg"
                      alt="A vibrant buffet spread of Indian dishes"
                      fill
                      className="object-cover transition-transform duration-[2000ms] group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-[#0f0f11]/10 to-transparent pointer-events-none" />
                  </div>
                </SpotlightCard>

                <div className="absolute -bottom-6 -left-6 z-20">
                  <MagneticHover magneticPull={0.2}>
                    <div className="bg-[#0f0f11] border border-[#d97706] p-8 md:p-10 rounded-sm shadow-2xl text-white w-56 overflow-hidden relative cursor-pointer group/badge">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#d97706]/10 to-transparent transition-opacity duration-500 opacity-0 group-hover/badge:opacity-100" />
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#d97706] filter blur-[40px] opacity-30 transition-transform duration-500 group-hover/badge:scale-150"></div>
                      <div className="flex items-center space-x-4 relative z-10">
                        <div className="w-12 h-12 bg-transparent border border-[#d97706] rounded-full flex items-center justify-center flex-shrink-0 group-hover/badge:bg-[#d97706] group-hover/badge:text-[#0f0f11] text-[#d97706] transition-colors duration-300">
                          <Award className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="text-3xl font-bold font-serif text-[#d97706] group-hover/badge:text-white transition-colors duration-300">15+</div>
                          <div className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mt-1">
                            {t("years_experience", "Years Experience", "વર્ષોનો અનુભવ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </MagneticHover>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-[#0f0f11]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              {t("our_values_title", "Our Values", "અમારા મૂલ્યો")}
            </h2>
            <p className="text-lg text-gray-500 font-light">
              {t(
                "values_description",
                "These core values guide everything we do and help us deliver exceptional experiences.",
                "આ મુખ્ય મૂલ્યો અમે જે કરીએ છીએ તે બધાને માર્ગદર્શન આપે છે અને અમને અસાધારણ અનુભવો પહોંચાડવામાં મદદ કરે છે.",
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <SpotlightCard key={index} className="rounded-sm p-0 group bg-[#18181b] border-[#27272a] hover:border-[#d97706]/50 transition-all duration-500 transform hover:-translate-y-2 shadow-xl" spotlightColor="rgba(217, 119, 6, 0.2)">
                <Card
                  className="bg-transparent border-0 overflow-hidden relative h-full"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-8 text-center relative h-full flex flex-col items-center">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d97706] to-[#fbbf24] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />

                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0f0f11] border border-[#27272a] text-gray-400 rounded-full mb-6 group-hover:border-[#d97706] group-hover:text-[#d97706] group-hover:scale-110 transition-all duration-300 relative z-10">
                      <value.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-serif text-white mb-4 tracking-wide relative z-10">{value.title}</h3>
                    <p className="text-gray-500 font-light text-sm leading-relaxed relative z-10">{value.description}</p>
                  </CardContent>
                </Card>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-[#18181b] relative border-y border-[#27272a]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#18181b] to-[#0f0f11] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              {t("achievements_title", "Our Achievements", "અમારી સિદ્ધિઓ")}
            </h2>
            <p className="text-lg text-gray-500 font-light max-w-3xl mx-auto">
              {t(
                "achievements_description",
                "Numbers that reflect our commitment to excellence and customer satisfaction.",
                "આંકડાઓ જે શ્રેષ્ઠતા અને ગ્રાહક સંતુષ્ટિ પ્રત્યેની અમારી પ્રતિબદ્ધતાને દર્શાવે છે.",
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center group transform transition-all duration-700 delay-${index * 100} ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0f0f11] border border-[#27272a] rounded-full mb-6 transform group-hover:scale-110 transition-transform duration-300 group-hover:border-[#d97706] shadow-lg">
                  <stat.icon className="h-8 w-8 text-[#d97706]" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-serif">
                  <CountUp to={stat.value} separator={stat.value % 1 !== 0 ? "." : ","} className="inline-block" />
                  <span className="text-[#d97706]">{stat.suffix}</span>
                </div>
                <div className="text-gray-500 font-semibold uppercase tracking-[0.2em] text-[10px] md:text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-[#0f0f11]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              {t("our_team_title", "Meet Our Team", "અમારી ટીમને મળો")}
            </h2>
            <p className="text-lg text-gray-500 font-light max-w-3xl mx-auto">
              {t(
                "team_description",
                "Our passionate team of chefs and service professionals who make every event special.",
                "અમારી જુસ્સાદાર રસોઈયા અને સેવા વ્યાવસાયિકોની ટીમ જે દરેક કાર્યક્રમને ખાસ બનાવે છે.",
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: t("chef_name_1", "Mahesh Savaliya", "મહેશ સાવલીયા"),
                role: t("chef_role_1", "Founder", "સ્થાપક"),
                image: "/images/Maheshbhai-owner.jpg",
              },
              {
                name: t("chef_name_2", "Mihir Nathani", "મિહિર નાથાની"),
                role: t("chef_role_2", "Event Manager", "ઇવેન્ટ મેનેજર"),
                image: "/images/patel.jpg",
              },
              {
                name: t("chef_name_3", "Manish Savaliya", "મનીષ સાવલીયા"),
                role: t("chef_role_3", "Co-Founder", "સહ-સ્થાપક"),
                image: "/images/manis.jpg",
              },
            ].map((member, index) => (
              <SpotlightCard
                key={index}
                className="group p-0 rounded-sm bg-[#18181b] border-[#27272a] hover:border-[#d97706]/50 transition-all duration-500 transform hover:-translate-y-2 shadow-xl"
                spotlightColor="rgba(217, 119, 6, 0.2)"
              >
                <Card
                  className="bg-transparent border-0 overflow-hidden relative h-full"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-80 overflow-hidden border-b border-[#27272a]">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100 grayscale-[20%] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] to-transparent" />
                  </div>
                  <CardContent className="p-8 text-center relative pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d97706] to-[#fbbf24] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                    <h3 className="text-xl font-serif font-bold text-white mb-2 tracking-wide uppercase">{member.name}</h3>
                    <p className="text-[#d97706] font-semibold tracking-widest text-[10px] uppercase">{member.role}</p>
                  </CardContent>
                </Card>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
