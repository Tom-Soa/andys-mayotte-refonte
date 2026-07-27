import { sql } from '@/lib/db'
import ContactForm from '@/components/ContactForm'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Primitives'

export const metadata = {
  title: 'Contact et horaires',
  description: "Contactez Chez Andy's, grossiste alimentaire à Poroani (Chirongui, Mayotte) : adresse, téléphone, WhatsApp, email et horaires d'ouverture.",
  alternates: { canonical: '/contact' },
}

export const dynamic = 'force-dynamic'

function fmtTime(t) { return (t || '').replace(/^0/, '').replace(':', 'h') }

export default async function ContactPage() {
  const DAY_ORDER = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
  const hours = await sql`SELECT day, open, open_time AS "openTime", close_time AS "closeTime" FROM hours`
    .then(rows => [...rows].sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)))
    .catch(() => [])

  const infos = [
    {
      icon: <MapPin size={17} />,
      titre: 'Adresse',
      lignes: ['3 rue Mairie Annexe, Poroani', 'Quartier 100 Villas, 97620 Chirongui'],
    },
    {
      icon: <Phone size={17} />,
      titre: 'Téléphone et WhatsApp',
      lignes: ['+33 672 75 84 78'],
      href: 'tel:+33672758478',
    },
    {
      icon: <Mail size={17} />,
      titre: 'Email',
      lignes: ['contact@chezandys.com'],
      href: 'mailto:contact@chezandys.com',
    },
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* En-tete */}
      <div className="relative bg-primary-900 text-white overflow-hidden" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(201,161,74,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,161,74,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <span className="section-label on-dark">Nous contacter</span>
          <h1 className="font-serif font-semibold text-white leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
            Contact et horaires
          </h1>
          <p className="text-stone-300 text-sm md:text-base mt-4 max-w-md">
            Une question sur un produit, un stock, une commande en gros ?
            Nous répondons en général sous 24h.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

          {/* Coordonnees + horaires */}
          <Stagger className="space-y-4" stagger={0.1}>
            {infos.map(info => (
              <StaggerItem key={info.titre}>
                <div className="group flex items-start gap-4 p-5 rounded-md border transition-colors hover:border-primary-400/50" style={{ background: '#F9F5EE', borderColor: 'rgba(201,161,74,0.18)' }}>
                  <span className="w-10 h-10 rounded-sm bg-primary-900 text-primary-400 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5">
                    {info.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-primary-800 text-sm mb-0.5">{info.titre}</p>
                    {info.lignes.map(l => (
                      info.href
                        ? <a key={l} href={info.href} className="block text-stone-600 text-sm hover:text-primary-600 transition-colors">{l}</a>
                        : <p key={l} className="text-stone-600 text-sm">{l}</p>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}

            {/* Horaires */}
            <StaggerItem>
            <div className="p-5 rounded-md border" style={{ background: '#F9F5EE', borderColor: 'rgba(201,161,74,0.18)' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-sm bg-primary-900 text-primary-400 flex items-center justify-center shrink-0">
                  <Clock size={17} />
                </span>
                <p className="font-semibold text-primary-800 text-sm">Horaires d&apos;ouverture</p>
              </div>
              {hours.length > 0 ? (
                <ul className="space-y-1.5">
                  {hours.map(h => (
                    <li key={h.day} className="flex items-center justify-between text-sm">
                      <span className="text-stone-600">{h.day}</span>
                      <span className={h.open ? 'text-primary-800 font-medium' : 'text-stone-400'}>
                        {h.open ? `${fmtTime(h.openTime)} - ${fmtTime(h.closeTime)}` : 'Fermé'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-stone-600 text-sm">Lundi au samedi : 8h00 - 18h00</p>
              )}
            </div>
            </StaggerItem>
          </Stagger>

          {/* Formulaire */}
          <Reveal delay={0.15} y={28}>
            <div className="rounded-md border p-7 md:p-9 shadow-card" style={{ background: '#FDFAF5', borderColor: 'rgba(201,161,74,0.18)' }}>
              <h2 className="font-serif font-semibold text-primary-800 text-xl md:text-2xl mb-1.5">
                Envoyez-nous un message
              </h2>
              <p className="text-stone-500 text-sm mb-6">Réponse sous 24h en général.</p>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
