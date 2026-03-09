"use client"

import { useEffect, useState, use } from "react"
import Image from "next/image"
import { Calendar, MapPin, ArrowLeft, ArrowRight, PlayCircle, Image as ImageIcon, X } from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { getEventByIdAction } from "@/app/actions"
import Link from "next/link"

type Event = any

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { language, t } = useLanguage()
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { id } = use(params)

  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

  useEffect(() => {
    if (id) {
      fetchEventDetails(id)
    }
  }, [id])

  const fetchEventDetails = async (eventId: string) => {
    setIsLoading(true)
    const { data, error } = await getEventByIdAction(eventId)

    if (error) {
      console.error("Error fetching event details:", error)
      setEvent(null)
    } else {
      setEvent(data)
    }
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#171512]">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#eab308]"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#171512]">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            {t("event_not_found", "Event Not Found", "કાર્યક્રમ મળ્યો નથી")}
          </h2>
          <p className="text-gray-400 mb-8 font-light">
            {t(
              "event_not_found_desc",
              "The event you are looking for does not exist or has been removed.",
              "તમે શોધી રહ્યા છો તે કાર્યક્રમ અસ્તિત્વમાં નથી અથવા દૂર કરવામાં આવ્યો છે.",
            )}
          </p>
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-sm uppercase tracking-wider px-8 py-6 shadow-xl"
          >
            <Link href="/events">
              <ArrowLeft className="mr-3 h-4 w-4" />
              {t("back_to_events", "Back to Events", "કાર્યક્રમો પર પાછા જાઓ")}
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[75vh] min-h-[600px] w-full flex flex-col justify-end overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ y }}
          className="absolute inset-0 z-0 origin-top"
        >
          <Image
            src={
              event.image_url ||
              `/placeholder.svg?height=1080&width=1920&query=${encodeURIComponent(language === "gu" ? event.title_gu : event.title_en)}+event`
            }
            alt={language === "gu" ? event.title_gu : event.title_en}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/20" />
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="container mx-auto px-4 lg:px-12 relative z-10 pb-10"
        >
          <div className="max-w-5xl">
            {event.is_featured && (
              <div className="inline-block bg-primary text-primary-foreground text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 mb-6 rounded-sm shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                EXCLUSIVE EVENT
              </div>
            )}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif font-bold text-white leading-[1.05] drop-shadow-2xl mb-2">
              {language === "gu" ? event.title_gu : event.title_en}
            </h1>
          </div>
        </motion.div>
      </section>

      {/* Hero Action Bar */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-md relative z-40">
        <div className="container mx-auto px-4 lg:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10 text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground">
            {event.event_date && (
              <div className="flex items-center text-primary">
                <Calendar className="h-4 w-4 mr-3" />
                <span className="text-foreground">
                  {new Date(event.event_date).toLocaleDateString(language === "gu" ? "gu-IN" : "en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
            {event.location_en && (
              <div className="flex items-center text-primary">
                <MapPin className="h-4 w-4 mr-3" />
                <span className="text-foreground">{language === "gu" ? event.location_gu : event.location_en}</span>
              </div>
            )}
          </div>
          <Button
            asChild
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/20 hover:border-primary rounded-sm uppercase tracking-widest text-[10px] font-bold px-8 py-6 transition-all duration-300 w-full md:w-auto"
          >
            <Link href="/contact" className="flex items-center justify-center">
              {t("plan_masterpiece", "Plan Your Masterpiece", "તમારી માસ્ટરપીસનું આયોજન કરો")} <ArrowRight className="ml-3 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* The Experience Section */}
      <section className="py-24 md:py-32 bg-background relative">
        <div className="container mx-auto px-4 lg:px-12">
          <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start">
            <div className="md:w-5/12 shrink-0">
              <h3 className="text-primary text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-8">
                {t("the_experience", "The Experience", "અનુભવ")}
              </h3>
              <p className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold italic leading-tight text-foreground pr-8">
                {language === "gu" ? (event.quote_gu || "સમકાલીન કલા અને મોલેક્યુલર ગેસ્ટ્રોનોમીનું મિશ્રણ.") : (event.quote_en || "A fusion of contemporary art and molecular gastronomy.")}
              </p>
            </div>
            <div className="md:w-7/12 text-muted-foreground font-light leading-relaxed text-sm sm:text-base space-y-8 pt-2">
              <p className="whitespace-pre-wrap">{language === "gu" ? event.description_gu : event.description_en}</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Menu Highlights */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16 gap-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white shrink-0">The Menu Highlights</h2>
            <div className="hidden sm:block flex-grow mx-8 border-t border-border/50"></div>
            <span className="text-primary text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase shrink-0">
              Autumn Selection
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 overflow-hidden">
            {event.menu_highlights && event.menu_highlights.length > 0 ? (
              event.menu_highlights.map((item: any, idx: number) => (
                <div key={idx} className="group cursor-pointer flex flex-col h-full bg-transparent">
                  <div className="relative aspect-square mb-6 overflow-hidden rounded-sm bg-card shrink-0">
                    <Image src={item.image_url || event.images?.[idx] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop'} alt={item.title_en} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{language === "gu" ? item.title_gu : item.title_en}</h4>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed flex-grow pr-4">{language === "gu" ? item.description_gu : item.description_en}</p>
                </div>
              ))
            ) : (
              <>
                <div className="group cursor-pointer flex flex-col h-full bg-transparent">
                  <div className="relative aspect-square mb-6 overflow-hidden rounded-sm bg-card shrink-0">
                    <Image src={event.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop'} alt="Wild Forest Truffle Bisque" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">Wild Forest Truffle Bisque</h4>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed flex-grow pr-4">Infused with 24-month aged parmesan foam and hand-foraged porcini dust.</p>
                </div>
                <div className="group cursor-pointer flex flex-col h-full bg-transparent">
                  <div className="relative aspect-square mb-6 overflow-hidden rounded-sm bg-card shrink-0">
                    <Image src={event.images?.[1] || 'https://images.unsplash.com/photo-1544025162-831cd0acdb33?q=80&w=600&auto=format&fit=crop'} alt="A5 Wagyu & Gold Leaf" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">A5 Wagyu & Gold Leaf</h4>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed flex-grow pr-4">Seared over Binchotan charcoal, served with smoked umami reduction and edible gold.</p>
                </div>
                <div className="group cursor-pointer flex flex-col h-full bg-transparent">
                  <div className="relative aspect-square mb-6 overflow-hidden rounded-sm bg-card shrink-0">
                    <Image src={event.images?.[2] || 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop'} alt="The Dark Gallery" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">The Dark Gallery</h4>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed flex-grow pr-4">70% Peruvian cacao deconstruction with raspberry gel and basil crystals.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Video Section */}
      {event.video_url && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-sm overflow-hidden bg-[url('/placeholder.svg')] group shadow-[0_40px_100px_-20px_rgba(0,0,0,1)]"
            >
              <Image
                src={event.image_url || '/placeholder.svg'}
                alt="Video Thumbnail"
                fill
                className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-[0_0_30px_rgba(234,179,8,0.4)] transform group-hover:scale-110 transition-transform duration-300">
                  <PlayCircle className="w-10 h-10 md:w-12 md:h-12 fill-current" />
                </div>
              </div>

              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 pointer-events-none">
                <h3 className="text-xl md:text-3xl font-serif font-bold text-white mb-2 drop-shadow-md tracking-wide">Watch Event Highlights</h3>
                <p className="text-white/70 text-xs md:text-sm italic font-light tracking-wide">Video duration: 3:45</p>
              </div>

              {event.video_url.includes('youtube.com') || event.video_url.includes('youtu.be') ? (
                <iframe
                  src={event.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              ) : (
                <video
                  src={event.video_url}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
                  controls
                />
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Event Gallery */}
      {event.images && event.images.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-12">Event Gallery</h2>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {event.images.map((img: string, idx: number) => (
                <motion.div
                  layoutId={`gallery-image-${idx}`}
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className="relative overflow-hidden rounded-sm border border-transparent shadow-lg hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:border-primary/30 group cursor-pointer break-inside-avoid block transition-all duration-300"
                >
                  <img
                    src={img}
                    alt={`Event gallery image ${idx + 1}`}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                    <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-50 group-hover:scale-100" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Footer Block */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-12">
          <div className="bg-[#1c1a17] rounded-sm p-10 md:p-20 text-center shadow-2xl border border-white/5 relative overflow-hidden">
            {/* Subtle accent glow inside the box */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-white/5 rounded-full filter blur-[150px] pointer-events-none"></div>

            <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 relative z-10 drop-shadow-lg tracking-wide">
              Elevate Your Next Affair
            </h3>
            <p className="text-base md:text-lg text-muted-foreground font-light mb-12 max-w-2xl mx-auto leading-relaxed relative z-10">
              Whether it's an intimate gala or a corporate milestone, we bring culinary vision to life through unparalleled craftsmanship and service.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-widest uppercase px-10 py-7 text-[11px] rounded-sm shadow-xl transition-all duration-300 w-full sm:w-auto"
              >
                <Link href="/contact">Inquire For Your Event</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-[#24211d] border-white/10 hover:bg-[#2b2823] hover:border-white/20 text-white font-bold tracking-widest uppercase px-10 py-7 text-[11px] rounded-sm transition-all duration-300 w-full sm:w-auto"
              >
                <Link href="/events">View Other Case Studies</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Lightbox Gallery */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full z-50 bg-black/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <motion.div
              layoutId={`gallery-image-${event.images.indexOf(selectedImage)}`}
              className="relative w-full h-full max-w-6xl max-h-[85vh] rounded-sm overflow-hidden border-2 border-primary/20 flex items-center justify-center bg-black shadow-[0_0_100px_rgba(234,179,8,0.1)]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={selectedImage} alt="Fullscreen gallery image" fill className="object-contain" priority />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
