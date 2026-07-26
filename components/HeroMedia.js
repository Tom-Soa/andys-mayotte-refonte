'use client'

import { useState } from 'react'

/*
 * Fond du hero : video en boucle si /videos/hero.mp4 existe,
 * sinon repli automatique sur l'image (onError).
 * Regles anti-zoom iOS : hauteur du hero en svh (voir .hero-svh),
 * cadrage video par transform (jamais object-fit: cover).
 */
export default function HeroMedia() {
  const [videoOk, setVideoOk] = useState(true)

  return (
    <div className="absolute inset-0 overflow-hidden bg-primary-900">
      {/* Image de repli, toujours presente sous la video */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/site/hero.jpg')" }}
      />
      {videoOk && (
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setVideoOk(false)}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  )
}
