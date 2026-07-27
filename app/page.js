import Link from 'next/link'
import { sql } from '@/lib/db'
import ProductCard from '@/components/ProductCard'
import ReviewForm from '@/components/ReviewForm'
import HeroMedia from '@/components/HeroMedia'
import fallbackProducts from '@/data/products.json'
import { faqItems, faqJsonLd } from '@/data/faq'
import {
  ShoppingBag, CalendarCheck, Store, CreditCard,
  MapPin, Mail, ArrowRight, CheckCircle, Star
} from 'lucide-react'

function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-md p-6 border border-stone-100 shadow-card flex flex-col">
      {/* Étoiles */}
      <div className="flex gap-0.5 mb-3">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={16}
            fill={review.rating >= star ? '#C9A14A' : 'none'}
            stroke={review.rating >= star ? '#C9A14A' : '#d1d5db'}
            strokeWidth={1.5}
          />
        ))}
      </div>
      {/* Commentaire */}
      <p className="text-stone-600 text-sm leading-relaxed flex-1 mb-4 line-clamp-4">
        &ldquo;{review.comment}&rdquo;
      </p>
      {/* Auteur + date */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
        <p className="font-semibold text-primary-800 text-sm">{review.name || review.author_name}</p>
        {review.created_at && (
          <p className="text-xs text-stone-400">
            {new Date(review.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
          </p>
        )}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

function fmtTime(t) { return (t || '').replace(/^0/, '').replace(':', 'h') }
function fmtHours(h) { return h.open ? `${fmtTime(h.openTime)} - ${fmtTime(h.closeTime)}` : 'Fermé' }

export default async function HomePage() {
  const DAY_ORDER = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
  const [hoursRows, products, reviews] = await Promise.all([
    sql`SELECT day, open, open_time AS "openTime", close_time AS "closeTime" FROM hours`.then(rows =>
      [...rows].sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day))
    ).catch(() => []),
    sql`SELECT * FROM products ORDER BY id`.catch(() => []),
    sql`SELECT * FROM reviews WHERE approved = true ORDER BY created_at DESC LIMIT 6`.catch(() => []),
  ])
  const hours = hoursRows
  const dayOrder = [6, 0, 1, 2, 3, 4, 5]
  const todayIdx = dayOrder[(new Date().getDay())]
  const todayHours = hours[todayIdx] ?? null
  const todayLabel = todayHours
    ? (todayHours.open ? `Ouvert · ${fmtHours(todayHours)}` : "Fermé aujourd'hui")
    : 'Lun - Sam · 8h00 - 18h00'

  /* Produits vedettes : base de donnees, sinon catalogue local (products.json) */
  const productSource = products.length > 0 ? products : fallbackProducts
  const featuredProducts = (() => {
    const feat = productSource.filter(p => p.available && p.featured)
    return (feat.length > 0 ? feat : productSource.filter(p => p.available)).slice(0, 8)
  })()

  const steps = [
    { icon: <ShoppingBag size={22} />, step: '01', title: 'Choisissez', desc: 'Parcourez le catalogue et ajoutez vos produits au panier.' },
    { icon: <CalendarCheck size={22} />, step: '02', title: 'Réservez', desc: 'Sélectionnez une date et un créneau horaire de retrait.' },
    { icon: <Store size={22} />, step: '03', title: 'Récupérez', desc: "Présentez-vous chez Andy's à Poroani à l'heure choisie." },
    { icon: <CreditCard size={22} />, step: '04', title: 'Payez', desc: 'Le règlement se fait directement en magasin.' },
  ]

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative bg-white overflow-hidden">

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-14 pb-16 md:pt-24 md:pb-24 w-full">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

            {/* Texte principal */}
            <div className="flex-1 text-center md:text-left">

              {/* Localisation, ligne discrete */}
              <p className="anim-fade-in inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase text-primary-600 mb-6">
                <MapPin size={11} strokeWidth={2.5} />
                Poroani · Mayotte
              </p>

              {/* Titre principal, police signature du logo */}
              <h1
                className="anim-fade-up font-script text-primary-800 leading-[1.02] mb-6"
                style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)', fontWeight: 700 }}
              >
                Votre grossiste alimentaire
              </h1>

              <p className="anim-fade-up-1 text-stone-500 text-base md:text-lg leading-relaxed mb-9 max-w-md mx-auto md:mx-0">
                Commandez en ligne, choisissez votre créneau de retrait.
                Récupérez à Poroani et payez sur place.
              </p>

              <div className="anim-fade-up-2 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link href="/produits" className="btn-primary group">
                  <ShoppingBag size={16} className="shrink-0" />
                  Voir le catalogue
                  <ArrowRight size={15} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link href="/reservation" className="btn-outline group">
                  <CalendarCheck size={16} className="shrink-0" />
                  Réserver un créneau
                </Link>
              </div>
            </div>

            {/* Photo + statut du magasin, sans cadres superposes */}
            <div className="anim-fade-up-3 w-full md:w-[46%] shrink-0">
              <div className="relative overflow-hidden rounded-md" style={{ aspectRatio: '4/3' }}>
                <img
                  src="/images/site/hero.jpg"
                  alt="L'entrepôt Chez Andy's à Poroani"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Statut du jour, ligne sobre sous la photo */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm">
                <span className="inline-flex items-center gap-2 font-semibold text-primary-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {todayHours && !todayHours.open ? "Fermé aujourd'hui" : "Ouvert aujourd'hui"}
                </span>
                <span className="text-stone-500">{todayLabel.replace('Ouvert · ', '')}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          COMMENT ÇA MARCHE
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32" style={{ background: '#F7F2E8' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14 md:mb-18">
            <span className="section-label center">Simple & rapide</span>
            <h2 className="font-serif font-semibold text-primary-800 leading-tight"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Comment ça marche
            </h2>
          </div>

          {/* Desktop : timeline horizontale (ronds relies, design valide) */}
          <div className="hidden sm:grid sm:grid-cols-4 gap-0 relative">
            <div className="hidden lg:block absolute top-11 left-[calc(12.5%+1.5rem)] right-[calc(12.5%+1.5rem)] h-px z-0"
                 style={{ background: 'linear-gradient(90deg, rgba(201,161,74,0.3), rgba(201,161,74,0.6), rgba(201,161,74,0.3))' }} />
            {steps.map((item, idx) => (
              <div key={item.step} className={`reveal delay-${idx + 1} group relative z-10 flex flex-col items-center text-center px-4`}>
                <div className="relative mb-5">
                  <div className="relative z-10 w-[4.5rem] h-[4.5rem] rounded-full bg-primary-900 text-primary-400 flex items-center justify-center ring-4 transition-transform duration-300 group-hover:-translate-y-1"
                       style={{ '--tw-ring-color': '#F7F2E8', boxShadow: '0 6px 24px rgba(10,38,24,0.28)' }}>
                    {item.icon}
                  </div>
                </div>
                <span className="text-primary-500 text-[10px] font-bold tracking-[0.2em] mb-1.5 uppercase">Étape {item.step}</span>
                <h3 className="font-serif font-semibold text-primary-800 text-xl mb-2">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Mobile : timeline verticale sobre, sans cartes */}
          <div className="sm:hidden relative pl-12">
            <div className="absolute left-[1.35rem] top-2 bottom-2 w-px"
                 style={{ background: 'linear-gradient(180deg, rgba(201,161,74,0.5), rgba(201,161,74,0.15))' }} />
            <div className="space-y-8">
              {steps.map((item, idx) => (
                <div key={item.step} className={`reveal delay-${idx + 1} relative`}>
                  <div className="absolute -left-12 top-0 w-11 h-11 rounded-sm bg-primary-900 text-primary-400 flex items-center justify-center"
                       style={{ boxShadow: '0 4px 14px rgba(10,38,24,0.22)' }}>
                    {item.icon}
                  </div>
                  <span className="block text-primary-600 text-[10px] font-bold tracking-[0.22em] uppercase mb-0.5">Étape {item.step}</span>
                  <h3 className="font-serif font-semibold text-primary-800 text-xl leading-tight mb-1">{item.title}</h3>
                  <p className="text-[13px] text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PRODUITS EN VEDETTE
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28 border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="reveal text-center mb-10 md:mb-14">
            <span className="section-label">Sélection du moment</span>
            <h2 className="font-serif font-semibold text-primary-800 leading-tight"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
              Nos produits
            </h2>
          </div>

          {featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
                {featuredProducts.map((product, i) => (
                  <div key={product.id} className={`reveal delay-${Math.min(i + 1, 5)} h-full`}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Bouton vers le catalogue complet, sous la grille */}
              <div className="reveal text-center mt-10 md:mt-14">
                <Link
                  href="/produits"
                  className="inline-flex items-center justify-center gap-2 bg-primary-900 hover:bg-forest-800 active:scale-95 text-white font-semibold px-8 py-4 rounded-md text-sm transition-all shadow-forest hover:-translate-y-0.5 group"
                >
                  Voir tout le catalogue
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-stone-400">
              <p className="font-serif text-xl text-primary-800 mb-2">Catalogue en cours de mise à jour</p>
              <Link href="/produits" className="text-sm text-primary-500 underline">Voir tous les produits</Link>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          À PROPOS - fond forêt
      ══════════════════════════════════════════════════════════════ */}
      <section id="apropos" className="bg-primary-900 py-24 md:py-36">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

            {/* Image, plus haute pour equilibrer le texte */}
            <div className="reveal-left relative">
              <div className="relative rounded-md overflow-hidden shadow-forest h-[22rem] md:h-[34rem]">
                <img
                  src="/images/site/apropos.jpg"
                  alt="Entrepôt Chez Andy's"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Texte */}
            <div className="reveal-right">
              <span className="section-label on-dark">
                À propos
              </span>
              <h2
                className="font-serif font-semibold text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(2rem, 4.8vw, 3.25rem)' }}
              >
                Andy&apos;s,<br />votre partenaire<br />alimentaire
              </h2>
              <p className="text-stone-300 leading-relaxed mb-5 text-base max-w-md">
                Basé à Poroani, Andy&apos;s approvisionne professionnels et particuliers
                en produits alimentaires : boissons, épicerie, conserves, céréales.
              </p>
              <p className="text-stone-400 leading-relaxed mb-9 text-base max-w-md">
                Préparez votre commande depuis chez vous, choisissez votre créneau,
                et repartez sans attendre.
              </p>

              <ul className="space-y-3.5 mb-10">
                {[
                  'Réservation en ligne, sans frais',
                  'Paiement sur place à la récupération',
                  'Ouvert du lundi au samedi',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-[15px] text-stone-200">
                    <CheckCircle size={16} className="text-primary-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/a-propos" className="btn-primary group">
                Découvrir Chez Andy&apos;s
                <ArrowRight size={15} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          AVIS CLIENTS
      ══════════════════════════════════════════════════════════════ */}
      {reviews.length > 0 && (
        <section className="py-20 md:py-28 border-t border-stone-100" style={{background: '#F7F2E8'}}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="section-label center">Ils nous font confiance</span>
              <h2 className="font-serif font-semibold text-primary-800" style={{fontSize:'clamp(2rem,5vw,3.25rem)'}}>
                Avis clients
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            <ReviewForm />
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white border-t border-stone-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="section-label center">Questions fréquentes</span>
            <h2 className="font-serif font-semibold text-primary-800" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 2.75rem)' }}>
              Tout savoir avant de commander
            </h2>
          </div>
          <div className="space-y-3">
            {faqItems.slice(0, 4).map((item, i) => (
              <details key={i} className="group bg-stone-50/60 border border-stone-200 rounded-md px-5 py-4 transition-colors hover:border-primary-200">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-serif font-semibold text-primary-800 text-base md:text-lg">
                  <span>{item.q}</span>
                  <span className="text-primary-500 transition-transform group-open:rotate-45 select-none mt-1" aria-hidden>+</span>
                </summary>
                <p className="mt-3 text-stone-600 text-sm md:text-base leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>

          {/* Vers la FAQ complete */}
          <div className="reveal text-center mt-10">
            <Link
              href="/faq"
              className="btn-outline group"
            >
              Voir la FAQ
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* FAQ JSON-LD (les 4 questions visibles sur cette page) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqItems.slice(0, 4))) }}
        />
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CTA CENTRAL
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 md:py-32" style={{ background: '#F7F2E8' }}>
        {/* Image de fond très subtile */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.07]"
          style={{ backgroundImage: "url('/images/site/cta-bg.jpg')" }}
        />
        {/* Décoration or */}
        <div className="absolute top-0 left-0 right-0 h-px"
             style={{ background: 'linear-gradient(90deg, transparent, rgba(201,161,74,0.35), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px"
             style={{ background: 'linear-gradient(90deg, transparent, rgba(201,161,74,0.25), transparent)' }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <span className="section-label center">Prêt à commander ?</span>
          <h2
            className="reveal font-serif font-semibold text-primary-800 mb-6 leading-tight"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)' }}
          >
            Passez votre<br />commande en ligne
          </h2>
          <p className="reveal delay-1 text-stone-600 text-sm md:text-base mb-11 max-w-md mx-auto leading-relaxed">
            Ajoutez vos produits, réservez un créneau, venez récupérer et payez sur place.
          </p>
          {/* Action principale, puis lien secondaire vers le contact */}
          <div className="reveal delay-2 flex flex-col items-center gap-6">
            <Link href="/produits" className="btn-dark group">
              <ShoppingBag size={16} className="shrink-0" />
              Voir les produits
              <ArrowRight size={15} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-800 border-b border-primary-800/25 hover:border-primary-800 pb-1 transition-colors"
            >
              <Mail size={14} className="text-primary-600" />
              Nous contacter
              <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
