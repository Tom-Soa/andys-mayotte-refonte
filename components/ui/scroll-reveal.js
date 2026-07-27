'use client'

/*
 * ScrollReveal, composant issu de 21st.dev (@cnippet.dev/scroll-reveal),
 * adapte en JavaScript et branche sur framer-motion.
 * Anime n'importe quel contenu a son entree dans le viewport, avec
 * variantes libres, seuil configurable et mode "une seule fois".
 */
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef, useState } from 'react'

const defaultVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export function ScrollReveal({
  children,
  variants = defaultVariants,
  transition,
  viewOptions,
  as = 'div',
  once = true,
  className,
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, viewOptions)
  const [isViewed, setIsViewed] = useState(false)
  const reduce = useReducedMotion()

  const MotionComponent = motion[as] || motion.div

  /* Mouvement desactive : on affiche directement l'etat final */
  if (reduce) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView || isViewed ? 'visible' : 'hidden'}
      onAnimationComplete={() => { if (once) setIsViewed(true) }}
      transition={transition}
      variants={variants}
    >
      {children}
    </MotionComponent>
  )
}

export default ScrollReveal
