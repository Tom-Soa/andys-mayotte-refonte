import Link from 'next/link'
import { faqItems, faqJsonLd } from '@/data/faq'
import { ArrowRight, MessageCircle } from 'lucide-react'

export const metadata = {
  title: 'FAQ, questions fréquentes',
  description: "Toutes les réponses sur la commande, la réservation de créneau, le paiement et le retrait en magasin chez Andy's, grossiste alimentaire à Poroani, Mayotte.",
  alternates: { canonical: '/faq' },
}

export default function FaqPage() {
  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqItems)) }}
      />

      {/* En-tete */}
      <div className="relative bg-primary-900 text-white overflow-hidden" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(201,161,74,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,161,74,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <span className="section-label on-dark">Questions fréquentes</span>
          <h1 className="font-serif font-semibold text-white leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
            Tout savoir avant<br />de commander
          </h1>
          <p className="text-stone-300 text-sm md:text-base mt-4 max-w-md">
            Commande, réservation, paiement, retrait : les réponses aux questions
            que l&apos;on nous pose le plus souvent.
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-3xl mx-auto px-4 py-14 md:py-20">
        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <details key={i} className="group bg-stone-50/60 border border-stone-200 rounded-md px-5 py-4 transition-colors hover:border-primary-200">
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-serif font-semibold text-primary-800 text-base md:text-lg">
                <span>{item.q}</span>
                <span className="text-primary-500 transition-transform group-open:rotate-45 select-none mt-1" aria-hidden>+</span>
              </summary>
              <p className="mt-3 text-stone-600 text-sm md:text-base leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>

        {/* Une autre question ? */}
        <div className="mt-14 rounded-md border border-stone-200 bg-stone-50/60 p-7 md:p-9 text-center">
          <MessageCircle size={22} className="mx-auto text-primary-500 mb-3" />
          <h2 className="font-serif font-semibold text-primary-800 text-xl md:text-2xl mb-2">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="text-stone-500 text-sm mb-6">
            Écrivez-nous, nous répondons en général sous 24h.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-primary-900 hover:bg-forest-800 active:scale-95 text-white font-semibold px-7 py-3.5 rounded-md text-sm transition-all"
            >
              Nous contacter <ArrowRight size={14} />
            </Link>
            <a
              href="https://wa.me/33672758478"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-primary-800/50 text-primary-800 hover:bg-primary-800 hover:text-white font-semibold px-7 py-3.5 rounded-md text-sm transition-all"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
