import Link from "next/link"
import { Phone, Mail, Clock, MapPin } from "lucide-react"
import { getSettingsByKeys } from "@/lib/settings"

export default async function Footer() {
  const settings = await getSettingsByKeys([
    "contact_email",
    "contact_phone",
    "contact_address",
    "meta_description",
  ])

  const email = settings.contact_email || "info@geruestbauer24.eu"
  const phone = settings.contact_phone || "+49 1639540595"
  const address = settings.contact_address || ""
  const description = settings.meta_description || "Finden Sie zuverlässige Gerüstbaufirmen in Ihrer Region. Geprüfte Unternehmen und echte Bewertungen."

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">
              {"Gerüstbauer"}<span className="text-primary">{"24"}</span>
            </h3>
            <p className="text-slate-300 mb-4">
              {description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Schnelllinks</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/geruestbau" className="text-slate-300 hover:text-primary transition-colors">
                  Firmen finden
                </Link>
              </li>
              <li>
                <Link href="/ueber-uns" className="text-slate-300 hover:text-primary transition-colors">
                  {"Über uns"}
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-slate-300 hover:text-primary transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/auth/registrieren" className="text-slate-300 hover:text-primary transition-colors">
                  Firma eintragen
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Rechtliches</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/impressum" className="text-slate-300 hover:text-primary transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-slate-300 hover:text-primary transition-colors">
                  {"Datenschutzerklärung"}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-300 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Kontakt</h3>
            <ul className="space-y-3">
              {phone && (
                <li className="flex items-center gap-2 text-slate-300">
                  <Phone size={18} className="text-primary flex-shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-primary transition-colors">{phone}</a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-2 text-slate-300">
                  <Mail size={18} className="text-primary flex-shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-primary transition-colors">{email}</a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2 text-slate-300">
                  <MapPin size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <span>{address}</span>
                </li>
              )}
              <li className="flex items-center gap-2 text-slate-300">
                <Clock size={18} className="text-primary flex-shrink-0" />
                <span>Mo-Fr: 8:00 - 18:00 Uhr</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-slate-400">
          <p>{"© "}{new Date().getFullYear()}{" Gerüstbauer24. Alle Rechte vorbehalten."}</p>
        </div>
      </div>
    </footer>
  )
}
