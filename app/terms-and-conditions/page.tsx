"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"

export default function TermsAndConditionsPage() {
  const { t } = useLanguage()

  const terms = [
    {
      en: "The party must meet in person to book the order.",
      gu: "ઓર્ડર બુક કરવા માટે પાર્ટીએ રૂબરૂ મળવું પડશે.",
    },
    {
      en: "50% of the amount will have to be paid in advance at the time of booking the order.",
      gu: "ઓર્ડર બુક કરતી વખતે 50% રકમ એડવાન્સ ચૂકવવી પડશે.",
    },
    {
      en: "If the order is canceled, the deposit will not be refunded.",
      gu: "જો ઓર્ડર રદ થશે તો ડિપોઝિટ પરત કરવામાં આવશે નહીં.",
    },
    {
      en: "The party will have to make arrangements for the wedding hall, party plot, drinking water, buffet counter, and chairs.",
      gu: "પાર્ટીએ લગ્ન હોલ, પાર્ટી પ્લોટ, પીવાનું પાણી, બુફે કાઉન્ટર અને ખુરશીઓની વ્યવસ્થા કરવી પડશે.",
    },
    {
      en: "The number of people written will remain fixed.",
      gu: "લખાવેલ વ્યક્તિઓની સંખ્યા નિશ્ચિત રહેશે.",
    },
    {
      en: "If the utensils are mandatory in the garden, the rental party will have to pay for it.",
      gu: "જો બગીચામાં વાસણો ફરજિયાત હશે, તો તેનું ભાડું પાર્ટીએ ચૂકવવું પડશે.",
    },
    {
      en: "Local Pyaaro -2000 VIP Pyaaro -5000. The money of the Pyaaro will have to be given by the party itself.",
      gu: "લોકલ પ્યારો -2000 વીઆઇપી પ્યારો -5000. પ્યારોના પૈસા પાર્ટીએ પોતે આપવા પડશે.",
    },
    {
      en: "In the afternoon, the staff will come from 2:30 to 3 pm. If he sees earlier, his extra money will have to be paid by Party A.",
      gu: "બપોરે સ્ટાફ 2:30 થી 3 વાગ્યાની વચ્ચે આવશે. જો તે વહેલો આવે તો તેનો વધારાનો ખર્ચ પાર્ટીએ ચૂકવવો પડશે.",
    },
    {
      en: "If you change the item after the price of the dish is fixed, you will have to pay for it separately.",
      gu: "જો વાનગીની કિંમત નક્કી થયા પછી વસ્તુ બદલવામાં આવે, તો તેના માટે અલગથી ચૂકવણી કરવી પડશે.",
    },
    {
      en: "If there is a change in the people after the price of the dish is fixed, its price will vary.",
      gu: "જો વાનગીની કિંમત નક્કી થયા પછી વ્યક્તિઓની સંખ્યામાં ફેરફાર થાય, તો તેની કિંમત બદલાશે.",
    },
    {
      en: "The party will have to pay the rent for the garbage collection team of the party plot.",
      gu: "પાર્ટીએ પાર્ટી પ્લોટની કચરા સંગ્રહ ટીમનું ભાડું ચૂકવવું પડશે.",
    },
    {
      en: "The water for the function outside the village will be on the party.",
      gu: "ગામની બહારના કાર્યક્રમ માટે પાણીની વ્યવસ્થા પાર્ટીએ કરવી પડશે.",
    },
    {
      en: "The money for the tea and water table will be taken separately.",
      gu: "ચા અને પાણીના ટેબલ માટેના પૈસા અલગથી લેવામાં આવશે.",
    },
    {
      en: "The ice cream will not be served in the dish. The party will have to pay for it separately.",
      gu: "આઈસ્ક્રીમ ડીશમાં પીરસવામાં આવશે નહીં. પાર્ટીએ તેના માટે અલગથી ચૂકવણી કરવી પડશે.",
    },
    {
      en: "Only two people will be allowed in the function.",
      gu: "કાર્યક્રમમાં ફક્ત બે વ્યક્તિઓને જ મંજૂરી આપવામાં આવશે.",
    },
    {
      en: "Breakfast will be available only before 12 o'clock. No service will be available after 12 o'clock.",
      gu: "નાસ્તો ફક્ત 12 વાગ્યા પહેલા જ ઉપલબ્ધ રહેશે. 12 વાગ્યા પછી કોઈ સેવા ઉપલબ્ધ રહેશે નહીં.",
    },
    {
      en: "The item will change before the function is activated. There will be no change after activation.",
      gu: "કાર્યક્રમ સક્રિય થાય તે પહેલાં વસ્તુ બદલાશે. સક્રિયકરણ પછી કોઈ ફેરફાર થશે નહીં.",
    },
    {
      en: "Once the price of a dish is fixed, there will be no change in the price.",
      gu: "એકવાર વાનગીની કિંમત નક્કી થઈ જાય પછી કિંમતમાં કોઈ ફેરફાર થશે નહીં.",
    },
    {
      en: "We will not be responsible for picking up flower decorations, trash, chairs, and mattresses.",
      gu: "અમે ફૂલ સજાવટ, કચરો, ખુરશીઓ અને ગાદલા ઉપાડવા માટે જવાબદાર નથી.",
    },
    {
      en: "Food theme will be priced separately.",
      gu: "ફૂડ થીમની કિંમત અલગથી લેવામાં આવશે.",
    },
    {
      en: "When a customized order is sent, all these terms and conditions are checked.",
      gu: "જ્યારે કસ્ટમાઇઝ્ડ ઓર્ડર મોકલવામાં આવે છે, ત્યારે આ તમામ નિયમો અને શરતો તપાસવામાં આવે છે.",
    },
  ]

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-amber-700">
            {t("terms_title", "Terms and Conditions", "નિયમો અને શરતો")}
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none">
          <p className="mb-6 text-gray-700">
            {t(
              "terms_intro",
              "Please read the following terms and conditions carefully. These terms apply to all catering orders and services provided by Payal Catering.",
              "કૃપા કરીને નીચેના નિયમો અને શરતો કાળજીપૂર્વક વાંચો. આ શરતો પાયલ કેટરિંગ દ્વારા પૂરી પાડવામાં આવતી તમામ કેટરિંગ ઓર્ડર અને સેવાઓ પર લાગુ પડે છે.",
            )}
          </p>
          <ol className="list-decimal list-inside space-y-3 text-gray-800">
            {terms.map((term, index) => (
              <li key={index}>{t(`term_${index}`, term.en, term.gu)}</li>
            ))}
          </ol>
          <p className="mt-6 text-gray-700">
            {t(
              "terms_agreement",
              "By proceeding with a booking, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.",
              "બુકિંગ સાથે આગળ વધવાથી, તમે સ્વીકારો છો કે તમે આ નિયમો અને શરતો વાંચી, સમજી અને તેનાથી બંધાયેલા રહેવા માટે સંમત છો.",
            )}
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
