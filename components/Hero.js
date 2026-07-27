'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ShoppingBag, CalendarCheck, ArrowRight, MapPin } from 'lucide-react'
import { WordsReveal, EASE } from '@/components/motion/Primitives'
import HeroTexture from '@/components/HeroTexture'

/*
 * Hero : titre revele mot par mot, puis carrousel des produits reellement
 * en vente. Chaque vignette est un lien vers la fiche produit et porte son
 * prix ainsi qu'un bouton "Voir la fiche".
 */
export default function Hero({ statusLabel, isOpen, products = [] }) {
  const reduce = useReducedMotion()
  /* Le defilement se met en pause au survol pour permettre le clic */
  const [paused, setPaused] = useState(false)

  /* Uniquement des produits vendus, avec visuel */
  const catalogue = products.filter(p => p.image && p.available !== false)
  /* Duplique la liste pour une boucle sans couture */
  const strip = catalogue.length > 0 ? [...catalogue, ...catalogue] : []

  return (
    <section className="relative bg-white overflow-hidden">
      <HeroTexture />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-16 text-center">

        {/* Statut du magasin */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-flex items-center gap-4 mb-8 text-[11px] font-semibold tracking-[0.2em] uppercase"
        >
          <span className="inline-flex items-center gap-2 text-primary-800">
            <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-stone-400'}`} />
            {isOpen ? 'Ouvert' : 'Fermé'}
          </span>
          <span className="w-px h-3 bg-stone-200" />
          <span className="text-stone-400">{statusLabel}</span>
          <span className="w-px h-3 bg-stone-200 hidden sm:block" />
          <span className="hidden sm:inline-flex items-center gap-1.5 text-stone-400">
            <MapPin size={11} strokeWidth={2.5} />
            Poroani
          </span>
        </motion.div>

        {/* Titre : padding vertical genereux pour que les jambages
            de la police manuscrite ne soient jamais coupes */}
        <h1
          className="font-script text-primary-800 mb-7"
          style={{ fontSize: 'clamp(2.7rem, 8vw, 5.5rem)', fontWeight: 700, lineHeight: 1.35 }}
        >
          <WordsReveal
            text="Votre grossiste alimentaire"
            delay={0.15}
            wordClassName="text-primary-500"
            highlight={[1]}
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
          className="text-stone-500 text-base md:text-lg leading-relaxed mb-9 max-w-lg mx-auto"
        >
          Commandez en ligne, choisissez votre créneau de retrait.
          Récupérez à Poroani et payez sur place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link href="/produits" className="btn-primary group">
            <ShoppingBag size={16} className="shrink-0" />
            Voir le catalogue
            <ArrowRight size={15} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link href="/reservation" className="btn-outline group">
            <CalendarCheck size={16} className="shrink-0" />
            Réserver un créneau
          </Link>
        </motion.div>
      </div>

      {/* Carrousel des produits en vente */}
      {strip.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.1, margin: '-5% 0px -5% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative z-10 pb-16 md:pb-24"
        >
          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Fondus lateraux */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 z-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 z-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />

            <motion.div
              className="flex gap-4 md:gap-5 w-max px-4"
              animate={reduce || paused ? {} : { x: ['0%', '-50%'] }}
              transition={{ duration: 52, repeat: Infinity, ease: 'linear' }}
              style={{ willChange: 'transform' }}
            >
              {strip.map((p, i) => (
                <Link
                  key={`${p.id}-${i}`}
                  href={`/produits/${p.id}`}
                  className="group/card relative shrink-0 w-44 md:w-60 bg-white rounded-md overflow-hidden border border-stone-150 shadow-card hover:shadow-hover hover:-translate-y-1.5 transition-all duration-300"
                  style={{ borderColor: 'rgba(28,24,20,0.08)' }}
                >
                  {/* Visuel, produit entier visible */}
                  <div className="h-28 md:h-36 bg-cream-50 flex items-center justify-center overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover/card:scale-105"
                    />
                  </div>

                  {/* Nom, prix, appel a l'action */}
                  <div className="px-3.5 pt-3 pb-3.5 text-left">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary-600 mb-1">
                      {p.category}
                    </p>
                    <p className="font-semibold text-primary-800 text-[13px] leading-snug line-clamp-1 mb-2">
                      {p.name}
                    </p>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="font-bold text-primary-500 text-base">
                        {parseFloat(p.price).toFixed(2)} €
                      </span>
                      {p.unit && <span className="text-[11px] text-stone-400">/ {p.unit}</span>}
                    </div>
                    <span className="flex items-center justify-center gap-1.5 w-full py-2 rounded-sm bg-primary-900 group-hover/card:bg-primary-500 text-white text-[11px] font-semibold tracking-wide transition-colors duration-300">
                      Voir la fiche
                      <ArrowRight size={12} className="transition-transform duration-300 group-hover/card:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </section>
  )
}
