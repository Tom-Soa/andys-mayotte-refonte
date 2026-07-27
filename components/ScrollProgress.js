'use client'

import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'

/* Fin liseret dore qui suit la progression de lecture, sous le header */
export default function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 })

  if (reduce) return null

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, rgba(201,161,74,0.5), #C9A14A)',
      }}
      aria-hidden="true"
    />
  )
}
