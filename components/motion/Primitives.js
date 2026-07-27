'use client'

import { motion, useReducedMotion } from 'framer-motion'

/* Easing signature du projet et durees standard */
export const EASE = [0.22, 1, 0.36, 1]
export const DUR = { fast: 0.45, med: 0.7, slow: 0.9 }

/* Revelation au scroll, jouee une seule fois */
export function Reveal({ children, delay = 0, y = 24, className, as = 'div' }) {
  const reduce = useReducedMotion()
  const M = motion[as] || motion.div
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduce ? 0 : DUR.med, delay: reduce ? 0 : delay, ease: EASE }}
    >
      {children}
    </M>
  )
}

/* Conteneur qui orchestre l'entree de ses enfants en cascade */
export function Stagger({ children, className, stagger = 0.09, delay = 0.05, amount = 0.2 }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: reduce ? 0 : delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

/* Enfant d'un Stagger */
export function StaggerItem({ children, className, y = 20 }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : y },
        visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : DUR.med, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  )
}

/*
 * Titre revele mot par mot.
 * Les mots montent en fondu sans masque de decoupe : une police
 * manuscrite a des jambages qui depassent de la ligne et seraient
 * rognes par un overflow: hidden.
 */
export function WordsReveal({ text, className, wordClassName, delay = 0, highlight = [] }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: reduce ? 0 : delay } },
      }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={`inline-block ${highlight.includes(i) ? wordClassName || '' : ''}`}
          variants={{
            hidden: { opacity: 0, y: reduce ? 0 : '38%', filter: reduce ? 'none' : 'blur(6px)' },
            visible: {
              opacity: 1,
              y: '0%',
              filter: 'blur(0px)',
              transition: { duration: reduce ? 0 : 0.9, ease: EASE },
            },
          }}
        >
          {word}
          {i < words.length - 1 && ' '}
        </motion.span>
      ))}
    </motion.span>
  )
}

/* Carte qui se souleve legerement au survol */
export function HoverLift({ children, className, lift = -6 }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      whileHover={reduce ? {} : { y: lift }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      {children}
    </motion.div>
  )
}

/* Compteur qui s'incremente a l'entree dans le viewport */
export function CountUp({ to, suffix = '', className, duration = 1.6 }) {
  const reduce = useReducedMotion()
  if (reduce) return <span className={className}>{to}{suffix}</span>
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.span
        initial={{ '--n': 0 }}
        whileInView={{ '--n': to }}
        viewport={{ once: true }}
        transition={{ duration, ease: 'easeOut' }}
        style={{ '--n': 0 }}
      >
        <motion.span>{to}</motion.span>
      </motion.span>
      {suffix}
    </motion.span>
  )
}
