"use client"

import type React from "react"
import { useState } from "react"
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { submitInquiryAction } from "@/app/actions"
import { SpotlightCard } from "@/components/react-bits/SpotlightCard"

export default function ContactPage() {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    event_type: "",
    event_date: "",
    guest_count: "",
    message: "",
  })

  // Calculate tomorrow's date for the minimum event date
  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const year = tomorrow.getFullYear()
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0")
    const day = String(tomorrow.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }
  const minDate = getTomorrowDate()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await submitInquiryAction({
        ...formData,
        guest_count: formData.guest_count ? Number.parseInt(formData.guest_count) : null,
        event_date: formData.event_date || null,
      })

      if (error) throw new Error(error)

      setIsSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        event_type: "",
        event_date: "",
        guest_count: "",
        message: "",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      alert(
        t(
          "form_error",
          "There was an error submitting your inquiry. Please try again.",
          "તમારી પૂછપરછ સબમિટ કરવામાં ભૂલ હતી. કૃપા કરીને ફરી પ્રયાસ કરો.",
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      title: t("contact_phone", "Phone", "ફોન"),
      details: ["+91 97147 99377", "+91 93136 77629"],
      action: "tel:+97147 99377",
    },
    {
      icon: Mail,
      title: t("contact_email", "Email", "ઈમેલ"),
      details: ["info@payalcatering.com", "orders@payalcatering.com"],
      action: "mailto:info@payalcatering.com",
    },
    {
      icon: MapPin,
      title: t("contact_address", "Address", "સરનામું"),
      details: [t("address_line", "Purusharth Society, Haridhva Road,opp.Balaji Temple, Rajkot-360002", "પુરુષાર્થ સોસાયટી, હરિધ્વા રોડ, બાલાજી મંદિર સામે, રાજકોટ-360002")],
      action: "https://maps.google.com",
    },
    {
      icon: Clock,
      title: t("contact_hours", "Business Hours", "વ્યવસાયિક કલાકો"),
      details: [
        t("hours_weekdays", "Mon - Fri: 9:00 AM - 8:00 PM", "સોમ - શુક્ર: 9:00 AM - 8:00 PM"),
        t("hours_weekend", "Sat - Sun: 10:00 AM - 6:00 PM", "શનિ - રવિ: 10:00 AM - 6:00 PM"),
      ],
    },
  ]

  const eventTypes = [
    { value: "wedding", label: t("event_wedding", "Wedding", "લગ્ન") },
    { value: "corporate", label: t("event_corporate", "Corporate Event", "કોર્પોરેટ ઇવેન્ટ") },
    { value: "birthday", label: t("event_birthday", "Birthday Party", "જન્મદિવસ પાર્ટી") },
    { value: "anniversary", label: t("event_anniversary", "Anniversary", "વર્ષગાંઠ") },
    { value: "festival", label: t("event_festival", "Festival", "તહેવાર") },
    { value: "other", label: t("event_other", "Other", "અન્ય") },
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0f0f11]">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md mx-4 rounded-sm shadow-2xl bg-[#18181b] border-[#27272a]">
            <CardContent className="p-10 text-center">
              <CheckCircle className="h-20 w-20 text-[#d97706] mx-auto mb-6" />
              <h2 className="text-3xl font-serif font-bold text-white mb-4">
                {t("form_success_title", "Thank You!", "આભાર!")}
              </h2>
              <p className="text-gray-400 font-light mb-8 leading-relaxed">
                {t(
                  "form_success_message",
                  "Your inquiry has been submitted successfully. We will contact you within 24 hours.",
                  "તમારી પૂછપરછ સફળતાપૂર્વક સબમિટ કરવામાં આવી છે. અમે 24 કલાકની અંદર તમારો સંપર્ક કરીશું.",
                )}
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                className="w-full bg-[#d97706] hover:bg-[#b45309] text-black font-semibold uppercase tracking-wider rounded-sm p-6"
              >
                {t("submit_another", "Submit Another Inquiry", "બીજી પૂછપરછ સબમિટ કરો")}
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

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
              {t("contact_greeting", "Let's Connect", "સંપર્ક કરો")}
            </h2>
            <Sparkles className="h-5 w-5 text-[#d97706] ml-3" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-white">
            {t("contact_title", "Contact Us", "અમારો સંપર્ક કરો")}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto font-light text-gray-400 tracking-wide">
            {t("contact_subtitle", "Get in touch for your catering needs", "તમારી કેટરિંગ જરૂરિયાતો માટે સંપર્કમાં રહો")}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-24 bg-[#0f0f11] relative border-y border-[#27272a]">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <SpotlightCard
                key={index}
                className="group p-0 rounded-sm bg-[#18181b] border-[#27272a] hover:border-[#d97706]/50 transition-all duration-500 transform hover:-translate-y-2 shadow-xl"
                spotlightColor="rgba(217, 119, 6, 0.2)"
              >
                <Card className="bg-transparent border-0 h-full overflow-hidden">
                  <CardContent className="p-8 text-center relative overflow-hidden h-full flex flex-col justify-center">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d97706] to-[#fbbf24] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />

                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0f0f11] border border-[#27272a] text-[#d97706] rounded-full mb-6 group-hover:bg-[#d97706] group-hover:text-black group-hover:border-[#d97706] group-hover:scale-110 transition-all duration-500 shadow-md relative z-10">
                      <info.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-serif font-semibold text-white mb-4 tracking-wide relative z-10">{info.title}</h3>
                    <div className="space-y-2 relative z-10">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-400 font-light text-sm leading-relaxed">
                          {info.action ? (
                            <a href={info.action} className="hover:text-[#d97706] transition-colors relative z-20">
                              {detail}
                            </a>
                          ) : (
                            detail
                          )}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 bg-[#0f0f11] relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                {t("inquiry_form_title", "Send Us an Inquiry", "અમને પૂછપરછ મોકલો")}
              </h2>
              <p className="text-lg text-gray-400 font-light max-w-2xl mx-auto">
                {t(
                  "inquiry_form_subtitle",
                  "Fill out the form below and we'll get back to you soon",
                  "નીચેનું ફોર્મ ભરો અને અમે ટૂંક સમયમાં તમારો સંપર્ક કરીશું",
                )}
              </p>
            </div>

            <Card className="shadow-2xl rounded-sm border-[#27272a] bg-[#18181b]">
              <CardContent className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3">
                        {t("form_name", "Full Name", "પૂરું નામ")} <span className="text-[#d97706]">*</span>
                      </label>
                      <Input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder={t("form_name_placeholder", "Enter your full name", "તમારું પૂરું નામ દાખલ કરો")}
                        className="bg-[#0f0f11] border-[#27272a] text-white focus-visible:ring-[#d97706] placeholder:text-gray-600 rounded-sm h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3">
                        {t("form_email", "Email Address", "ઈમેલ સરનામું")} <span className="text-[#d97706]">*</span>
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder={t("form_email_placeholder", "Enter your email", "તમારું ઈમેલ દાખલ કરો")}
                        className="bg-[#0f0f11] border-[#27272a] text-white focus-visible:ring-[#d97706] placeholder:text-gray-600 rounded-sm h-12"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3">
                        {t("form_phone", "Phone Number", "ફોન નંબર")}
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9+\s-]/g, "")
                          handleInputChange("phone", val)
                        }}
                        placeholder={t("form_phone_placeholder", "Enter your phone number", "તમારો ફોન નંબર દાખલ કરો")}
                        className="bg-[#0f0f11] border-[#27272a] text-white focus-visible:ring-[#d97706] placeholder:text-gray-600 rounded-sm h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3">
                        {t("form_event_type", "Event Type", "ઇવેન્ટનો પ્રકાર")}
                      </label>
                      <Select
                        value={formData.event_type}
                        onValueChange={(value) => handleInputChange("event_type", value)}
                      >
                        <SelectTrigger className="bg-[#0f0f11] border-[#27272a] text-white focus:ring-[#d97706] rounded-sm h-12 data-[state=open]:border-[#d97706]">
                          <SelectValue
                            placeholder={t("form_event_type_placeholder", "Select event type", "ઇવેન્ટનો પ્રકાર પસંદ કરો")}
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-[#18181b] border-[#27272a] text-white rounded-sm">
                          {eventTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="focus:bg-[#0f0f11] focus:text-[#d97706]">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3">
                        {t("form_event_date", "Event Date", "ઇવેન્ટની તારીખ")}
                      </label>
                      <Input
                        type="date"
                        value={formData.event_date}
                        onChange={(e) => handleInputChange("event_date", e.target.value)}
                        min={minDate}
                        className="bg-[#0f0f11] border-[#27272a] text-white focus-visible:ring-[#d97706] rounded-sm h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3">
                        {t("form_guest_count", "Number of Guests", "મહેમાનોની સંખ્યા")}
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.guest_count}
                        onChange={(e) => handleInputChange("guest_count", e.target.value)}
                        placeholder={t("form_guest_count_placeholder", "Approximate number", "અંદાજિત સંખ્યા")}
                        className="bg-[#0f0f11] border-[#27272a] text-white focus-visible:ring-[#d97706] placeholder:text-gray-600 rounded-sm h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3">
                      {t("form_message", "Message", "સંદેશ")}
                    </label>
                    <Textarea
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder={t(
                        "form_message_placeholder",
                        "Tell us more about your event requirements...",
                        "તમારી ઇવેન્ટની આવશ્યકતાઓ વિશે અમને વધુ જણાવો...",
                      )}
                      className="bg-[#0f0f11] border-[#27272a] text-white focus-visible:ring-[#d97706] placeholder:text-gray-600 rounded-sm"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#27272a] mt-8">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#d97706] hover:bg-[#b45309] text-black font-semibold uppercase tracking-wider py-6 rounded-sm shadow-xl transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                          {t("form_submitting", "Submitting...", "સબમિટ કરી રહ્યા છીએ...")}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Send className="mr-3 h-5 w-5" />
                          {t("form_submit", "Send Inquiry", "પૂછપરછ મોકલો")}
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-[#18181b] border-t border-[#27272a]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              {t("find_us", "Find Us on the Map", "નકશા પર અમને શોધો")}
            </h2>
            <p className="text-lg text-gray-500 font-light max-w-3xl mx-auto">
              {t("map_description", "Visit our location or get directions.", "અમારા સ્થાનની મુલાકાત લો અથવા દિશાઓ મેળવો.")}
            </p>
          </div>
          <Card className="shadow-2xl rounded-sm overflow-hidden border border-[#d97706]/30 max-w-5xl mx-auto">
            <CardContent className="p-0">
              <div className="relative h-[500px] w-full filter grayscale-[50%] contrast-[1.2] invert-[90%] hue-rotate-180">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.9385800000007!2d70.8085062!3d22.2577881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959ca80711e1caf%3A0x2ad3a9690e40a26b!2sSukhram%20Nagar%2C%20Bhakti%20Nagar%2C%20Rajkot%2C%20Gujarat%20360002!5e0!3m2!1sen!2sus!4v1678888888888!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Our Location on Map"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
