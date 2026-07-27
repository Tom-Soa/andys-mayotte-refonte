'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ShoppingBag, CalendarCheck, ArrowRight, MapPin } from 'lucide-react'
import { WordsReveal, EASE } from '@/components/motion/Primitives'

/*
 * Hero inspire du modele "Animated Marquee Hero" de 21st.dev :
 * titre revele mot par mot, puis bandeau d'images produits qui defile
 * en continu sous le contenu. Fond blanc, registre sobre.
 */
export default function Hero({ statusLabel, isOpen, products = [] }) {
  const reduce = useReducedMotion()

  /* Visuels du carrousel : photos produits, completees par les photos du site */
  const visuals = [
    ...products.filter(p => p.image).map(p => ({ src: p.image, label: p.name })),
    { src: '/images/site/hero.jpg', label: 'Notre entrepôt à Poroani' },
    { src: '/images/site/apropos.jpg', label: 'Le magasin' },
  ].slice(0, 8)

  const strip = [...visuals, ...visuals]

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Trame tres legere en fond, apporte de la matiere sans couleur */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.55]"
        style={{
          backgroundImage: 'linear-gradient(rgba(20,61,44,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(20,61,44,0.045) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-16 pb-10 md:pt-24 md:pb-14 text-center">

        {/* Statut du magasin, en direct */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-flex items-center gap-4 mb-8 text-[11px] font-semibold tracking-[0.2em] uppercase"
        >
          <span className="inline-flex items-center gap-2 text-primary-800">
            <span className="relative flex w-2 h-2">
              {isOpen && !reduce && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-emerald-500"
                  animate={{ scale: [1, 2.2], opacity: [0.55, 0] }}
                  transition={{ duration: 1.9, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <span className={`relative w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-stone-400'}`} />
            </span>
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

        {/* Titre revele mot par mot, police signature du logo */}
        <h1
          className="font-script text-primary-800 leading-[1.05] mb-7"
          style={{ fontSize: 'clamp(2.7rem, 8vw, 5.5rem)', fontWeight: 700 }}
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

      {/* Bandeau d'images qui defile en continu */}
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.85, ease: EASE }}
        className="relative z-10 pb-14 md:pb-20"
      >
        <div className="relative overflow-hidden">
          {/* Fondus lateraux */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

          <motion.div
            className="flex gap-4 md:gap-5 w-max"
            animate={reduce ? {} : { x: ['0%', '-50%'] }}
            transition={{ duration: 46, repeat: Infinity, ease: 'linear' }}
          >
            {strip.map((v, i) => (
              <div
                key={`${v.src}-${i}`}
                className="group relative shrink-0 w-40 h-28 md:w-56 md:h-40 rounded-md overflow-hidden bg-cream-100 border border-stone-100"
              >
                <img
                  src={v.src}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
