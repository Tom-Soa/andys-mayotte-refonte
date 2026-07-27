import Link from 'next/link'
import { sql } from '@/lib/db'
import ProductCard from '@/components/ProductCard'
import ReviewForm from '@/components/ReviewForm'
import Hero from '@/components/Hero'
import { Reveal, Stagger, StaggerItem, HoverLift, EASE } from '@/components/motion/Primitives'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
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

  /* Produits vedettes : base de donnees, sinon catalogue local (products.json).
     La section "Selection du moment" en montre 4 au maximum, le reste du
     catalogue est accessible via le bouton "Voir tout le catalogue". */
  const productSource = products.length > 0 ? products : fallbackProducts
  const availableProducts = productSource.filter(p => p.available)
  const featuredProducts = (() => {
    const feat = availableProducts.filter(p => p.featured)
    return (feat.length > 0 ? feat : availableProducts).slice(0, 4)
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
      <Hero
        statusLabel={todayLabel.replace('Ouvert · ', '')}
        isOpen={!todayHours || todayHours.open}
        products={availableProducts}
      />

      {/* ══════════════════════════════════════════════════════════════
          COMMENT ÇA MARCHE
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 md:py-32" style={{ background: '#F7F2E8' }}>
        {/* Texture generee (Higgsfield) : palmes, noix de coco, riz et jute
            a l'encre sauge et doree. Portrait sur telephone, paysage sinon. */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute inset-0 bg-cover bg-center md:hidden"
            style={{ backgroundImage: "url('/images/site/etapes-texture-mobile.jpg')" }}
          />
          <div
            className="hidden md:block absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/site/etapes-texture.jpg')" }}
          />
          {/* Voile creme : la texture reste lisible derriere le contenu */}
          <div className="absolute inset-0" style={{ background: 'rgba(247,242,232,0.62)' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <Reveal className="text-center mb-14 md:mb-18">
            <span className="section-label center">Simple & rapide</span>
            <h2 className="font-serif font-semibold text-primary-800 leading-tight"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Comment ça marche
            </h2>
          </Reveal>

          {/* Desktop : timeline horizontale (ronds relies, design valide) */}
          <Stagger className="hidden sm:grid sm:grid-cols-4 gap-0 relative" stagger={0.13}>
            <div className="hidden lg:block absolute top-11 left-[calc(12.5%+1.5rem)] right-[calc(12.5%+1.5rem)] h-px z-0"
                 style={{ background: 'linear-gradient(90deg, rgba(201,161,74,0.3), rgba(201,161,74,0.6), rgba(201,161,74,0.3))' }} />
            {steps.map(item => (
              <StaggerItem key={item.step} className="group relative z-10 flex flex-col items-center text-center px-4">
                <div className="relative mb-5">
                  <div className="relative z-10 w-[4.5rem] h-[4.5rem] rounded-full bg-primary-900 text-primary-400 flex items-center justify-center ring-4 transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:text-primary-300"
                       style={{ '--tw-ring-color': '#F7F2E8', boxShadow: '0 6px 24px rgba(10,38,24,0.28)' }}>
                    {item.icon}
                  </div>
                </div>
                <span className="text-primary-500 text-[10px] font-bold tracking-[0.2em] mb-1.5 uppercase">Étape {item.step}</span>
                <h3 className="font-serif font-semibold text-primary-800 text-xl mb-2">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>

          {/* Mobile : timeline verticale, plus aeree */}
          <Stagger className="sm:hidden relative pl-[4.25rem]" stagger={0.12}>
            <div className="absolute left-[1.6rem] top-3 bottom-3 w-px"
                 style={{ background: 'linear-gradient(180deg, rgba(201,161,74,0.5), rgba(201,161,74,0.12))' }} />
            <div className="space-y-11">
              {steps.map(item => (
                <StaggerItem key={item.step} className="relative">
                  <div className="absolute -left-[4.25rem] top-0 w-[3.25rem] h-[3.25rem] rounded-full bg-primary-900 text-primary-400 flex items-center justify-center ring-4"
                       style={{ '--tw-ring-color': '#F7F2E8', boxShadow: '0 4px 16px rgba(10,38,24,0.24)' }}>
                    {item.icon}
                  </div>
                  <span className="block text-primary-600 text-[10px] font-bold tracking-[0.22em] uppercase mb-1">Étape {item.step}</span>
                  <h3 className="font-serif font-semibold text-primary-800 text-[1.35rem] leading-tight mb-1.5">{item.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
                </StaggerItem>
              ))}
            </div>
          </Stagger>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PRODUITS EN VEDETTE
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28 border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="text-center mb-10 md:mb-14">
            <span className="section-label">Sélection du moment</span>
            <h2 className="font-serif font-semibold text-primary-800 leading-tight"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
              Nos produits
            </h2>
          </Reveal>

          {featuredProducts.length > 0 ? (
            <>
              <Stagger className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-stretch" stagger={0.07} amount={0.05}>
                {featuredProducts.map(product => (
                  <StaggerItem key={product.id} className="h-full" y={26}>
                    <ProductCard product={product} />
                  </StaggerItem>
                ))}
              </Stagger>

              {/* Bouton vers le catalogue complet, sous la grille */}
              <Reveal className="text-center mt-10 md:mt-14" delay={0.1}>
                <Link href="/produits" className="btn-dark group">
                  Voir tout le catalogue
                  <ArrowRight size={15} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Reveal>
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
      <section id="apropos" className="relative overflow-hidden bg-primary-900 py-24 md:py-36">
        {/* Texture generee (Higgsfield) : palmes, riz et jute a l'encre d'or.
            Version portrait sur telephone, paysage sur ordinateur. */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute inset-0 bg-cover bg-center md:hidden"
            style={{ backgroundImage: "url('/images/site/apropos-texture-mobile.jpg')" }}
          />
          <div
            className="hidden md:block absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/site/apropos-texture.jpg')" }}
          />
          {/* Voile leger : la texture reste franchement visible, le texte
              blanc conserve un contraste suffisant */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(10,38,24,0.28) 0%, rgba(10,38,24,0.5) 70%, rgba(10,38,24,0.66) 100%)' }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">

            {/* Image : colonne de gauche sur ordinateur, masquee sur
                telephone ou elle est inseree entre les deux paragraphes */}
            <ScrollReveal
              className="relative hidden md:block"
              variants={{
                hidden: { opacity: 0, x: -48, scale: 0.96 },
                visible: { opacity: 1, x: 0, scale: 1 },
              }}
              transition={{ duration: 0.9, ease: EASE }}
              viewOptions={{ amount: 0.2, margin: '-8% 0px -8% 0px' }}
            >
              <div className="group relative rounded-md overflow-hidden shadow-forest h-[34rem]">
                <img
                  src="/images/site/apropos.jpg"
                  alt="Entrepôt Chez Andy's"
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                />
              </div>
            </ScrollReveal>

            {/* Texte : centre sur telephone, aligne a gauche sur ordinateur */}
            <ScrollReveal
              className="text-center md:text-left"
              variants={{
                hidden: { opacity: 0, x: 48 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
              viewOptions={{ amount: 0.2, margin: '-8% 0px -8% 0px' }}
            >
              <span className="section-label on-dark">
                À propos
              </span>
              <h2
                className="font-serif font-semibold text-white leading-tight mb-6"
                style={{ fontSize: 'clamp(2rem, 4.8vw, 3.25rem)' }}
              >
                Andy&apos;s, votre<br />partenaire alimentaire
              </h2>
              <p className="text-stone-300 leading-relaxed mb-5 text-base max-w-md mx-auto md:mx-0">
                Basé à Poroani, Andy&apos;s approvisionne professionnels et particuliers
                en produits alimentaires : boissons, épicerie, conserves, céréales.
              </p>

              {/* Telephone : l'image s'intercale entre les deux paragraphes */}
              <div className="md:hidden group relative rounded-md overflow-hidden shadow-forest h-56 my-7">
                <img
                  src="/images/site/apropos.jpg"
                  alt="Entrepôt Chez Andy's"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-stone-400 leading-relaxed mb-9 text-base max-w-md mx-auto md:mx-0">
                Préparez votre commande depuis chez vous, choisissez votre créneau,
                et repartez sans attendre.
              </p>

              <ul className="space-y-3.5 mb-10 inline-block text-left md:block">
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
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          AVIS CLIENTS
      ══════════════════════════════════════════════════════════════ */}
      {reviews.length > 0 && (
        <section className="py-20 md:py-28 border-t border-stone-100" style={{background: '#F7F2E8'}}>
          <div className="max-w-6xl mx-auto px-4">
            <Reveal className="text-center mb-12">
              <span className="section-label center">Ils nous font confiance</span>
              <h2 className="font-serif font-semibold text-primary-800" style={{fontSize:'clamp(2rem,5vw,3.25rem)'}}>
                Avis clients
              </h2>
            </Reveal>
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.09}>
              {reviews.map(review => (
                <StaggerItem key={review.id} className="h-full">
                  <HoverLift className="h-full" lift={-5}>
                    <ReviewCard review={review} />
                  </HoverLift>
                </StaggerItem>
              ))}
            </Stagger>
            <ReviewForm />
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 md:py-28 bg-white border-t border-stone-100">
        {/* Texture generee (Higgsfield), motifs sur les cotes, centre degage */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute inset-0 bg-cover bg-center md:hidden"
            style={{ backgroundImage: "url('/images/site/faq-texture-mobile.jpg')" }}
          />
          <div
            className="hidden md:block absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/site/faq-texture.jpg')" }}
          />
          <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.58)' }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <Reveal className="text-center mb-12">
            <span className="section-label center">Questions fréquentes</span>
            <h2 className="font-serif font-semibold text-primary-800" style={{ fontSize: 'clamp(1.8rem, 4.5vw, 2.75rem)' }}>
              Tout savoir avant de commander
            </h2>
          </Reveal>
          <Stagger className="space-y-3" stagger={0.08}>
            {faqItems.slice(0, 4).map((item, i) => (
              <StaggerItem key={i} y={16}>
                {/* Contour discret, filet dore qui apparait a l'ouverture */}
                <details className="group relative overflow-hidden rounded-md border border-stone-200/90 bg-white/95 backdrop-blur-[2px] px-5 py-4 transition-all duration-300 hover:border-primary-400/60 hover:shadow-card open:border-primary-400/70 open:bg-white open:shadow-card">
                  <span
                    className="absolute left-0 top-0 bottom-0 w-[3px] scale-y-0 group-open:scale-y-100 origin-top transition-transform duration-400"
                    style={{ background: 'linear-gradient(180deg, #C9A14A, rgba(201,161,74,0.25))' }}
                    aria-hidden="true"
                  />
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-serif font-semibold text-primary-800 text-base md:text-lg">
                    <span>{item.q}</span>
                    <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full border border-primary-400/40 text-primary-500 flex items-center justify-center text-sm leading-none transition-all duration-300 group-open:rotate-45 group-open:bg-primary-500 group-open:text-white group-open:border-primary-500" aria-hidden>+</span>
                  </summary>
                  <p className="mt-3 text-stone-600 text-sm md:text-base leading-relaxed">
                    {item.a}
                  </p>
                </details>
              </StaggerItem>
            ))}
          </Stagger>

          {/* Vers la FAQ complete */}
          <Reveal className="text-center mt-10" delay={0.1}>
            <Link href="/faq" className="btn-outline group">
              Voir la FAQ
              <ArrowRight size={15} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
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
          <Reveal>
            <span className="section-label center">Prêt à commander ?</span>
            <h2
              className="font-serif font-semibold text-primary-800 mb-6 leading-tight"
              style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)' }}
            >
              Passez votre<br />commande en ligne
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-stone-600 text-sm md:text-base mb-11 max-w-md mx-auto leading-relaxed">
              Ajoutez vos produits, réservez un créneau, venez récupérer et payez sur place.
            </p>
          </Reveal>
          {/* Action principale, puis lien secondaire vers le contact */}
          <Reveal delay={0.22} className="flex flex-col items-center gap-6">
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
          </Reveal>
        </div>
      </section>
    </>
  )
}
