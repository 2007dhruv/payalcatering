"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Utensils, Search, X, ChevronDown, CheckCircle, Leaf, CalendarIcon, ClockIcon, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { getMenuItemsAndCategoriesAction, submitInquiryAction } from "@/app/actions"

type MenuItem = any
type SelectedMenuItem = MenuItem

function EventForm({
  onSubmit,
  isSubmitting,
  disabled,
  setIsTermsOpen,
}: {
  onSubmit: (formData: any, termsAccepted: boolean) => void
  isSubmitting: boolean
  disabled: boolean
  setIsTermsOpen: (open: boolean) => void
}) {
  const { language, t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    event_type: "",
    event_date: "",
    event_time: "",
    guest_count: "",
  })
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData, termsAccepted)
  }

  const eventTypes = [
    { value: "wedding", label: t("event_wedding", "Wedding", "લગ્ન") },
    { value: "corporate", label: t("event_corporate", "Corporate Event", "કોર્પોરેટ ઇવેન્ટ") },
    { value: "birthday", label: t("event_birthday", "Birthday Party", "જન્મદિવસ પાર્ટી") },
    { value: "other", label: t("event_other", "Other", "અન્ય") },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <Input
          type="text"
          placeholder={t("form_name", "Full Name", "પૂરું નામ")}
          required
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-2 h-auto text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:border-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="tel"
          placeholder={t("form_phone", "Phone", "મોબાઈલ નંબર")}
          required
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className="bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-2 h-auto text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:border-primary"
        />
        <Input
          type="number"
          placeholder={t("form_guests", "Guests", "મહેમાનોની સંખ્યા")}
          required
          min="1"
          value={formData.guest_count}
          onChange={(e) => handleInputChange("guest_count", e.target.value)}
          className="bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-2 h-auto text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:border-primary"
        />
      </div>

      <div className="pt-2">
        <Select
          value={formData.event_type}
          onValueChange={(val) => handleInputChange("event_type", val)}
          required
        >
          <SelectTrigger className="w-full bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-2 h-auto text-sm text-foreground focus:ring-0 focus:border-primary focus-visible:ring-0 focus-visible:border-primary">
            <SelectValue placeholder={t("form_event_type", "Event Type", "પ્રસંગનો પ્રકાર")} />
          </SelectTrigger>
          <SelectContent className="bg-card border-border text-foreground">
            {eventTypes.map(type => (
              <SelectItem key={type.value} value={type.value} className="focus:bg-primary/20 focus:text-primary cursor-pointer">{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="relative">
          <Input
            type="date"
            required
            value={formData.event_date}
            onChange={(e) => handleInputChange("event_date", e.target.value)}
            className="bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-2 h-auto text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:border-primary [color-scheme:dark]"
          />
        </div>
        <div className="relative">
          <Input
            type="time"
            required
            value={formData.event_time}
            onChange={(e) => handleInputChange("event_time", e.target.value)}
            className="bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-2 h-auto text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:border-primary [color-scheme:dark]"
          />
        </div>
      </div>

      <div className="flex items-start space-x-3 pt-6">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked === true)}
          className="mt-1 border-muted-foreground/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <label htmlFor="terms" className="text-xs text-muted-foreground font-light leading-snug cursor-pointer group hover:text-primary transition-colors">
          {t("form_agree", "I agree to the", "હું સંમત છું")} <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsTermsOpen(true); }} className="text-primary underline decoration-primary/50 underline-offset-2 hover:text-primary/80">{t("terms_link", "Terms of Service", "નિયમો અને શરતો સાથે")}</button>.
        </label>
      </div>

      <Button
        type="submit"
        disabled={disabled || !termsAccepted || isSubmitting}
        className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-widest text-xs uppercase py-6 rounded-sm disabled:opacity-50 disabled:bg-primary/50 transition-all"
      >
        {isSubmitting ? t("form_processing", "Processing...", "પ્રક્રિયા ચાલુ છે...") : t("form_submit", "Request Quote", "ક્વોટેશન મોકલો")}
      </Button>
    </form>
  )
}

export default function CreateMenuPage() {
  const { language, t } = useLanguage()
  const [categories, setCategories] = useState<any[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenuItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false)
  const [isTermsOpen, setIsTermsOpen] = useState(false)

  // Which categories are expanded? Open all by default initially.
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})
  const [formResetKey, setFormResetKey] = useState(0)

  useEffect(() => {
    fetchMenuData()
  }, [])

  useEffect(() => {
    filterItems()
  }, [menuItems, searchTerm, language])

  const fetchMenuData = async () => {
    setIsLoading(true)
    const { itemsData, categoriesData } = await getMenuItemsAndCategoriesAction()

    if (categoriesData) {
      setCategories(categoriesData)
      // Open all categories by default
      const initialOpenState = categoriesData.reduce((acc: any, cat: any) => {
        acc[cat.id] = true
        return acc
      }, {})
      setOpenCategories(initialOpenState)
    }
    if (itemsData) setMenuItems(itemsData.filter((i: any) => i.is_available))
    setIsLoading(false)
  }

  const filterItems = () => {
    let filtered = menuItems
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          (language === "gu" ? item.name_gu : item.name_en).toLowerCase().includes(searchLower) ||
          (language === "gu" ? item.description_gu : item.description_en)?.toLowerCase().includes(searchLower),
      )
    }
    setFilteredItems(filtered)
  }

  const toggleCategory = (id: string) => {
    setOpenCategories(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleAddItem = (item: MenuItem) => {
    setSelectedMenu((prev) => {
      const existingItem = prev.find((selected) => selected.id === item.id)
      if (existingItem) return prev
      return [...prev, item]
    })
  }

  const handleRemoveItem = (itemId: string) => {
    setSelectedMenu((prev) => prev.filter((item) => item.id !== itemId))
  }

  const handleFinalSubmit = async (submittedFormData: any, termsAccepted: boolean) => {
    setIsSubmitting(true)

    if (selectedMenu.length === 0) {
      alert(t("select_items_warning", "Please select at least one menu item.", "કૃપા કરીને એક વાનગી પસંદ કરો."))
      setIsSubmitting(false)
      return
    }

    if (!termsAccepted) {
      alert(t("terms_warning", "Please accept the terms and conditions.", "કૃપા કરીને શરતો સ્વીકારો."))
      setIsSubmitting(false)
      return
    }

    try {
      const { error } = await submitInquiryAction({
        ...submittedFormData,
        email: submittedFormData.email || "not-provided@example.com",
        type: "custom_menu",
        selected_menu_items: selectedMenu.map((item) => ({
          id: item.id,
          name_en: item.name_en,
          name_gu: item.name_gu,
        })),
      })

      if (error) throw new Error(error)

      setIsSubmitted(true)
      setSelectedMenu([])
      setIsMobileCartOpen(false)
      setFormResetKey(prev => prev + 1)
    } catch (error) {
      console.error("Error submitting:", error)
      alert(t("form_error", "There was an error submitting.", "ભૂલ આવી."))
    } finally {
      setIsSubmitting(false)
    }
  }


  const termsOfService = [
    {
      en: "The party must meet in person to book the order.",
      gu: "પાર્ટીએ રૂબરૂ મળીને ઓર્ડર બુક કરાવવાનો રહેશે."
    },
    {
      en: "50% of the amount will have to be paid in advance at the time of booking the order.",
      gu: "ઓર્ડર બુક કરાવતી વખતે ૫૦% એડવાન્સ રકમ ચૂકવવાની રહેશે."
    },
    {
      en: "If the order is canceled, the deposit will not be refunded.",
      gu: "જો ઓર્ડર કેન્સલ થાય તો, એડવાન્સ રકમ પરત કરવામાં આવશે નહીં."
    },
    {
      en: "The party will have to make arrangements for the wedding hall, party plot, drinking water, buffet counter, and chairs.",
      gu: "વાડી, પાર્ટી પ્લોટ, પીવાનું પાણી, બુફે કાઉન્ટર અને ખુરશીઓની વ્યવસ્થા પાર્ટીએ જાતે કરવાની રહેશે."
    },
    {
      en: "The number of people written will remain fixed.",
      gu: "લખાવેલી સંખ્યા ફિક્સ રહેશે."
    },
    {
      en: "If utensils are mandatory in the garden/venue, the rental party will have to pay for them.",
      gu: "જો વાડીમાં વાસણ ફરજીયાત હશે તો ભાડું પાર્ટીએ ભોગવવાનું રહેશે."
    },
    {
      en: "Local labor - 2000, VIP labor - 5000. Labor wages must be paid directly by the party.",
      gu: "લોકલ મજુર - ર૦૦૦, વી.આઈ.પી. મજુર - ૫૦૦૦. મજુરીના પૈસા પાર્ટીએ જાતે આપવાના રહેશે."
    },
    {
      en: "The staff will come in the afternoon from 2:30 to 3:00 PM. If called earlier, their extra wages must be paid by the party.",
      gu: "બપોરે સ્ટાફ ૨:૩૦ થી ૩ વાગ્યા સુધીમાં આવશે, જો વહેલા બોલાવશો તો તેના વધારાના મજુરીના પૈસા પાર્ટીએ ચૂકવવાના રહેશે."
    },
    {
      en: "If you change the items after the price of the dish is fixed, you will have to pay for the changes separately.",
      gu: "ડીશનો ભાવ નક્કી થયા પછી જો કોઈ આઈટમમાં ફેરફાર કરશો તો તેના પૈસા અલગથી ચૂકવવાના રહેશે."
    },
    {
      en: "If there is a change in the headcount after the price of the dish is fixed, the price will vary.",
      gu: "ડીશનો ભાવ નક્કી થયા પછી માણસોમાં વધઘટ થશે તો તેનો ભાવ અલગ રહેશે."
    }
  ]

  // Container variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  // Item variants
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  }


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-primary flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card className="bg-card border-border shadow-2xl">
              <CardContent className="p-10 text-center">
                <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl font-serif text-foreground mb-4">
                  {t("menu_success_title", "Request Sent Successfully", "વિનંતી સફળતાપૂર્વક મોકલવામાં આવી છે")}
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {t("menu_success_desc", "Your exquisite culinary selection has been received. Our team will contact you shortly to finalize the details.", "તમારી પસંદગીની વાનગીઓની યાદી મળી ગઈ છે. વિગતો નક્કી કરવા માટે અમારી ટીમ ટૂંક સમયમાં તમારો સંપર્ક કરશે.")}
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-wider uppercase rounded-sm"
                >
                  {t("menu_success_btn", "Build Another Menu", "બીજું મેનુ બનાવો")}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground selection:bg-primary/30">
      <Header />

      <main className="flex-1 container mx-auto px-4 lg:px-6 py-12">

        {/* Hero Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <Badge variant="outline" className="mb-6 font-medium tracking-[0.2em] border-primary text-primary bg-transparent uppercase">
            {t("menu_hero_badge", "Curated Excellence", "શ્રેષ્ઠ ગુણવત્તા")}
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6">
            {language === "gu" ? (
              <>તમારું <span className="text-primary italic">ખાસ</span> મેનુ બનાવો</>
            ) : (
              <>Craft Your <span className="text-primary italic">Signature</span> Menu</>
            )}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed hidden md:block max-w-2xl mx-auto">
            {t("menu_hero_desc", "Select from our collection of premium dishes designed for sophisticated palates. Build a culinary journey that reflects the elegance of your occasion.", "તમારા પ્રસંગને અનુરૂપ અમારી શ્રેષ્ઠ વાનગીઓમાંથી પસંદગી કરો. એક એવું મેનુ તૈયાર કરો જે તમારા પ્રસંગની ભવ્યતાને દર્શાવે છે.")}
          </p>

          {/* Search */}
          <div className="relative mt-10 max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary h-4 w-4" />
            <Input
              type="text"
              placeholder={t("menu_search_placeholder", "Search for exquisite dishes...", "તમારી મનપસંદ વાનગી શોધો...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary rounded-sm"
            />
          </div>
        </motion.div>

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative items-start">

          {/* LEFT: Menu Items */}
          <div className="flex-1 space-y-6">
            {categories.map((category) => {
              const categoryItems = filteredItems.filter((item) => item.category_id === category.id)
              if (categoryItems.length === 0 && searchTerm) return null

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5 }}
                  key={category.id}
                  className="border-b border-border/50 pb-6 last:border-b-0"
                >
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center justify-between w-full py-4 text-left group"
                  >
                    <h2 className="text-xl sm:text-2xl font-serif text-muted-foreground group-hover:text-primary transition-colors">
                      {language === "gu" ? category.name_gu : category.name_en}
                    </h2>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${openCategories[category.id] ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {openCategories[category.id] && (
                      <motion.div
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        variants={containerVariants}
                        className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-6 mt-4 overflow-hidden"
                      >
                        {categoryItems.map((item, idx) => (
                          <motion.div key={item.id} variants={itemVariants}>
                            <Card className="bg-card border-border overflow-hidden flex flex-col h-full outline-none">
                              <div className="relative h-36 sm:h-48 w-full group overflow-hidden">
                                <Image
                                  priority={idx < 2}
                                  src={
                                    item.image_url ||
                                    `/placeholder.svg?height=200&width=400&query=${encodeURIComponent(item.name_en) || "food"}`
                                  }
                                  alt={language === "gu" ? item.name_gu : item.name_en}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-90" />

                                {item.is_vegetarian && (
                                  <Badge className="absolute top-3 left-3 bg-background/80 border-green-500/50 text-green-500 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-sm">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 inline-block"></span>
                                    VEG
                                  </Badge>
                                )}
                              </div>
                              <CardContent className="p-3 sm:p-5 flex-1 flex flex-col justify-between z-10 -mt-6 sm:-mt-6">
                                <div>
                                  <h3 className="text-base sm:text-lg font-serif text-foreground mb-1 sm:mb-2 leading-tight drop-shadow-md">
                                    {language === "gu" ? item.name_gu : item.name_en}
                                  </h3>
                                  <p className="text-xs sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-6 font-light">
                                    {language === "gu" ? item.description_gu : item.description_en}
                                    {!item.description_en && "Exquisite culinary preparation crafted with the finest ingredients."}
                                  </p>
                                </div>

                                <div className="flex justify-between items-end mt-auto">
                                  <span className="text-[10px] text-muted-foreground/50 tracking-widest uppercase font-mono">
                                    ITEM-{item.id.toString().substring(0, 4)}
                                  </span>

                                  {selectedMenu.some((selected) => selected.id === item.id) ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleRemoveItem(item.id)}
                                      className="border-primary text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary font-semibold tracking-wider text-[9px] sm:text-[10px] px-2 sm:px-4 rounded-sm transition-all"
                                    >
                                      ADDED <CheckCircle className="ml-1 sm:ml-1.5 h-3 w-3" />
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleAddItem(item)}
                                      className="border-border text-muted-foreground bg-transparent hover:border-primary hover:text-primary hover:bg-primary/5 font-semibold tracking-wider text-[9px] sm:text-[10px] px-2 sm:px-4 rounded-sm transition-all"
                                    >
                                      SELECT <Plus className="ml-1 sm:ml-1.5 h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* RIGHT: Sticky Form Panel / Mobile Modal */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`
              w-full lg:w-[400px] flex-shrink-0 space-y-6 lg:space-y-6
              ${isMobileCartOpen ? "fixed inset-0 z-50 bg-background/95 backdrop-blur-md p-4 overflow-y-auto" : "hidden lg:block lg:sticky lg:top-32 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto custom-scrollbar"}
            `}
          >
            {isMobileCartOpen && (
              <div className="lg:hidden flex justify-end mb-2">
                <Button variant="outline" size="icon" onClick={() => setIsMobileCartOpen(false)} className="rounded-full border-border bg-card">
                  <X className="h-4 w-4 text-foreground" />
                </Button>
              </div>
            )}
            <Card className="bg-card border-border rounded-sm shadow-2xl shadow-black/50 lg:border-border border-primary/20">
              <CardContent className="p-0">

                {/* Selected Menu Header */}
                <div className="p-6 border-b border-border flex justify-between items-center bg-card/50">
                  <h3 className="font-serif text-foreground font-medium tracking-wide">{t("menu_selected", "Selected Menu", "પસંદ કરેલ મેનુ")}</h3>
                  <Badge className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 text-[10px] tracking-widest py-0.5 rounded-sm">
                    {selectedMenu.length} {t("menu_items_count", "ITEMS", "વાનગીઓ")}
                  </Badge>
                </div>

                {/* Items List */}
                <div className="p-6">
                  {selectedMenu.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center mx-auto mb-4 bg-primary/5">
                        <Utensils className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-foreground font-serif mb-1">{t("menu_empty_title", "Your Plate is Empty", "તમારી પ્લેટ ખાલી છે")}</p>
                      <p className="text-xs text-muted-foreground font-light">{t("menu_empty_desc", "Begin your culinary journey by selecting dishes from the menu.", "મેનુમાંથી વાનગીઓ પસંદ કરીને તમારી ડીશ તૈયાર કરો.")}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {selectedMenu.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex justify-between items-start group"
                          >
                            <div>
                              <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                                {language === "gu" ? item.name_gu : item.name_en}
                              </p>
                            </div>
                            <button onClick={() => handleRemoveItem(item.id)} className="text-muted-foreground hover:text-red-500 transition-colors ml-4 mt-0.5">
                              <X className="h-3 w-3" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>



                {/* Event Form */}
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <span className="w-6 h-[1px] bg-primary mr-3"></span>
                    <h4 className="font-serif tracking-wide text-primary">{t("menu_event_details", "Event Details", "પ્રસંગની વિગતો")}</h4>
                  </div>

                  <EventForm
                    key={formResetKey}
                    onSubmit={handleFinalSubmit}
                    isSubmitting={isSubmitting}
                    disabled={selectedMenu.length === 0}
                    setIsTermsOpen={setIsTermsOpen}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.aside>
        </div>
        {/* Mobile Floating Cart Button */}
        <AnimatePresence>
          {selectedMenu.length > 0 && !isMobileCartOpen && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="lg:hidden fixed bottom-6 left-4 right-4 z-40"
            >
              <Button
                onClick={() => setIsMobileCartOpen(true)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-serif tracking-wide py-7 outline-none rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-between px-6 border-t border-primary/50"
              >
                <div className="flex items-center space-x-3">
                  <Utensils className="h-5 w-5 opacity-80" />
                  <span className="text-lg">{t("menu_mobile_view", "View Culinary Selection", "પસંદ કરેલ વાનગીઓ જુઓ")}</span>
                </div>
                <Badge className="bg-background text-primary font-bold px-3 py-1 rounded-sm shadow-inner">{selectedMenu.length}</Badge>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* Terms and Conditions Modal */}
      <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
        <DialogContent className="max-w-2xl bg-card border-border text-foreground max-h-[85vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-primary text-center mb-4">
              {t("terms_title", "Terms and Conditions", "નિયમો અને શરતો")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground text-center mb-6">
              {t(
                "terms_intro",
                "Please read the following terms and conditions carefully. These terms apply to all catering orders and services provided by Payal Catering.",
                "કૃપા કરીને નીચેની શરતો અને નિયમો ધ્યાનપૂર્વક વાંચો. આ શરતો પાયલ કેટરિંગ દ્વારા પૂરી પાડવામાં આવતી તમામ કેટરિંગ સેવાઓ અને ઓર્ડર પર લાગુ પડશે."
              )}
            </p>
            <ol className="list-decimal list-outside ml-4 space-y-4 text-sm text-foreground">
              {termsOfService.map((term, index) => (
                <li key={index} className="pl-2 leading-relaxed text-muted-foreground">
                  {language === "gu" ? term.gu : term.en}
                </li>
              ))}
            </ol>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
