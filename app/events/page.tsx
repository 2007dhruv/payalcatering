"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { getActiveEventsAction } from "@/app/actions"
import Link from "next/link"
import { SpotlightCard } from "@/components/react-bits/SpotlightCard"
import { SplitText } from "@/components/react-bits/SplitText"
import { ShinyText } from "@/components/react-bits/ShinyText"

export default function EventsPage() {
  const { language, t } = useLanguage()
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setIsLoading(true)
    const { data } = await getActiveEventsAction()

    if (data) setEvents(data)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f11]">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#d97706]"></div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f11] text-gray-200">
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden bg-background">
        {/* Dark Luxury Gradient Orbs */}
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-primary rounded-full filter blur-[100px] opacity-15 animate-blob"></div>
        <div className="absolute top-40 right-[15%] w-80 h-80 bg-accent rounded-full filter blur-[120px] opacity-10 animate-blob animation-delay-2000"></div>

        {/* Traditional Pattern Underlay */}
        <div
          className="absolute inset-0 opacity-[0.02] bg-repeat pointer-events-none"
          style={{ backgroundImage: `url('/images/pattern-bg.png')`, backgroundSize: '400px' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4"
        >
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-5 w-5 text-primary mr-3" />
            <ShinyText text={t("events_greeting", "Memorable Moments", "યાદગાર ક્ષણો")} className="text-sm font-semibold tracking-[0.2em] uppercase" />
            <Sparkles className="h-5 w-5 text-primary ml-3" />
          </div>

          <SplitText
            text={t("events_title", "Our Events", "અમારા કાર્યક્રમો")}
            className="text-5xl md:text-6xl font-serif font-bold mb-4 text-white"
            delay={0.1}
          />
          <p className="text-lg md:text-xl max-w-3xl mx-auto font-light text-gray-400 tracking-wide">
            {t(
              "events_subtitle",
              "Celebrating memorable moments with exceptional catering",
              "અસાધારણ કેટરિંગ સાથે યાદગાર ક્ષણોની ઉજવણી",
            )}
          </p>
        </motion.div>
      </section>

      {/* Events Grid */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4 max-w-7xl">
          {events.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border rounded-sm max-w-2xl mx-auto">
              <div className="text-6xl mb-4 opacity-50">🥂</div>
              <h3 className="text-2xl font-serif text-white mb-2">
                {t("no_events_found", "No events found", "કોઈ કાર્યક્રમો મળ્યા નથી")}
              </h3>
              <p className="text-gray-500 font-light">
                {t("events_coming_soon", "New events will be added soon", "નવા કાર્યક્રમો ટૂંક સમયમાં ઉમેરવામાં આવશે")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event: any, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  key={event.id}
                >
                  <SpotlightCard className="h-full rounded-sm" spotlightColor="rgba(234, 179, 8, 0.08)">
                    <Card
                      className="group bg-card border-transparent hover:border-primary/20 transition-all duration-500 overflow-hidden shadow-2xl h-full flex flex-col"
                    >
                      <div className="relative h-72 overflow-hidden shrink-0">
                        <Image
                          src={
                            event.image_url ||
                            `/placeholder.svg?height=400&width=600&query=catering+event+${index + 1 || "/placeholder.svg"}+celebration`
                          }
                          alt={language === "gu" ? event.title_gu : event.title_en}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90 group-hover:opacity-100"
                        />
                        {/* Soft Linear Gradient overlay replacing hard borders */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card to-transparent pointer-events-none" />

                        {event.images && event.images.length > 0 && (
                          <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm border border-white/5 flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-primary" /> {event.images.length} Photos
                          </div>
                        )}

                        {event.is_featured && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-background border border-primary/50 text-primary rounded-sm px-3 py-1 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
                              {t("featured", "Featured", "વિશેષ")}
                            </Badge>
                          </div>
                        )}
                        <div className="absolute bottom-4 left-6 right-6 z-10">
                          <h3 className="text-2xl font-serif font-bold text-white mb-1 drop-shadow-md">
                            {language === "gu" ? event.title_gu : event.title_en}
                          </h3>
                        </div>
                      </div>
                      <CardContent className="p-6 relative flex-grow flex flex-col bg-card">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />

                        <p className="text-muted-foreground font-light mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">
                          {language === "gu" ? event.description_gu : event.description_en}
                        </p>

                        <div className="space-y-3 mb-6 shrink-0">
                          {event.event_date && (
                            <div className="flex items-center text-xs font-semibold tracking-wide text-gray-500 uppercase">
                              <Calendar className="h-4 w-4 mr-3 text-primary" />
                              {new Date(event.event_date).toLocaleDateString(language === "gu" ? "gu-IN" : "en-IN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          )}

                          {(event.location_en || event.location_gu) && (
                            <div className="flex items-center text-xs font-semibold tracking-wide text-gray-500 uppercase">
                              <MapPin className="h-4 w-4 mr-3 text-primary" />
                              {language === "gu" ? event.location_gu : event.location_en}
                            </div>
                          )}
                        </div>

                        <div className="pt-4 mt-auto shrink-0">
                          <Button
                            variant="outline"
                            asChild
                            className="w-full bg-background border-border text-muted-foreground hover:border-primary hover:text-primary font-semibold tracking-wider uppercase rounded-sm transition-all duration-300"
                          >
                            <Link href={`/events/${event.id}`}>
                              {t("view_details", "View Details", "વિગતો જુઓ")}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background relative border-t-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-primary rounded-full filter blur-[150px] opacity-10 pointer-events-none"></div>
        <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
          <div className="inline-block mb-6">
            <span className="text-[10px] text-primary border border-primary/40 px-3 py-1 font-semibold tracking-widest uppercase rounded-sm bg-primary/5">
              Get Started
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
            {t("events_cta_title", "Planning Your Own Event?", "તમારા પોતાના કાર્યક્રમનું આયોજન કરી રહ્યા છો?")}
          </h2>
          <p className="text-lg text-gray-400 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            {t(
              "events_cta_description",
              "Let us help you create unforgettable memories with our professional catering services.",
              "અમારી વ્યાવસાયિક કેટરિંગ સેવાઓ સાથે અવિસ્મરણીય યાદો બનાવવામાં અમને તમારી મદદ કરવા દો.",
            )}
          </p>
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase tracking-wider px-10 py-6 text-sm rounded-sm shadow-xl transition-all duration-300"
          >
            <Link href="/contact" className="flex items-center">
              {t("get_quote", "Get a Quote", "કોટ મેળવો")}
              <ArrowRight className="ml-3 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
