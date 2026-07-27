'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import {
  ShoppingCart, Menu, X, Home, Package,
  CalendarCheck, ArrowRight, Info, Mail, ReceiptText, HelpCircle,
} from 'lucide-react'

/* Icone WhatsApp (SVG officiel simplifie) */
function WhatsAppIcon({ size = 21 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.363.626 4.676 1.816 6.71L2.667 29.333l6.832-1.794A13.267 13.267 0 0 0 16.003 29.333c7.363 0 13.33-5.973 13.33-13.333S23.366 2.667 16.003 2.667zm0 24A10.603 10.603 0 0 1 10.34 25.2l-.38-.226-3.95 1.037 1.053-3.84-.248-.395A10.574 10.574 0 0 1 5.333 16c0-5.888 4.782-10.667 10.67-10.667S26.667 10.112 26.667 16 21.888 26.667 16.003 26.667zm5.82-7.987c-.318-.16-1.883-.928-2.175-1.035-.293-.107-.506-.16-.72.16-.213.318-.825 1.035-.011 1.248.107.107.213.16.32.213-.32.08-1.77-.16-3.346-1.726a6.24 6.24 0 0 1-1.602-2.415c-.16-.32 0-.48.12-.64.107-.107.24-.267.347-.4.107-.133.145-.24.213-.4.068-.16.034-.32-.017-.453-.052-.133-.72-1.733-.986-2.373-.267-.64-.534-.56-.72-.56-.187 0-.4-.027-.613-.027s-.56.08-.853.4c-.293.32-1.12 1.093-1.12 2.666s1.147 3.094 1.307 3.307c.16.213 2.255 3.44 5.467 4.826 3.213 1.387 3.213.92 3.787.866.573-.053 1.853-.76 2.12-1.493.266-.733.266-1.36.186-1.493-.08-.134-.294-.214-.612-.374z" />
    </svg>
  )
}

export default function Header() {
  const { totalItems } = useCart()
  const pathname = usePathname()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Ferme le menu a chaque navigation */
  useEffect(() => { setSheetOpen(false) }, [pathname])

  /* Bloque le scroll derriere le menu mobile ouvert */
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sheetOpen])

  const navLinks = [
    { href: '/',            label: 'Accueil' },
    { href: '/produits',    label: 'Catalogue' },
    { href: '/reservation', label: 'Réservation' },
    { href: '/a-propos',    label: 'À propos' },
    { href: '/faq',         label: 'FAQ' },
    { href: '/blog',        label: 'Actualités' },
    { href: '/contact',     label: 'Contact' },
  ]

  const isActive = href =>
    href === '/' ? pathname === '/' : !href.includes('#') && pathname?.startsWith(href)

  /* Barre basse mobile : WhatsApp integre, burger en dernier */
  const bottomNav = [
    { href: '/',         icon: <Home size={21} />,         label: 'Accueil' },
    { href: '/produits', icon: <Package size={21} />,      label: 'Produits' },
    { href: '/panier',   icon: <ShoppingCart size={21} />, label: 'Panier', badge: totalItems },
    { href: 'https://wa.me/33672758478', icon: <WhatsAppIcon />, label: 'WhatsApp', external: true, whatsapp: true },
  ]

  /* Liens du menu mobile (bottom sheet) */
  const sheetLinks = [
    { href: '/reservation',  icon: <CalendarCheck size={17} />, label: 'Réserver un créneau', cta: true },
    { href: '/a-propos',     icon: <Info size={17} />,          label: 'À propos' },
    { href: '/contact',      icon: <Mail size={17} />,          label: 'Contact' },
    { href: '/faq',          icon: <HelpCircle size={17} />,       label: 'FAQ' },
    { href: '/mes-commandes',icon: <ReceiptText size={17} />,   label: 'Mes commandes' },
  ]

  return (
    <>
      {/* Header sticky : desktop + barre haute mobile */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-primary-900 shadow-forest border-b border-white/10'
            : 'bg-primary-900/95 backdrop-blur-md border-b border-white/[0.07]'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-3">

          {/* Logo : "Chez Andy's" toujours visible, a toutes tailles */}
          <Link href="/" className="flex items-center gap-2.5 md:gap-3 group min-w-0 shrink-0">
            <div className="relative shrink-0">
              <img
                src="/logo.png"
                alt="Chez Andy's"
                className="h-9 w-9 md:h-10 md:w-10 rounded-full object-cover ring-2 ring-primary-500/40 group-hover:ring-primary-500/70 transition-all"
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
              />
              <div className="hidden h-9 w-9 md:h-10 md:w-10 rounded-full bg-primary-500/20 border border-primary-500/40 items-center justify-center text-primary-400 text-lg font-serif font-bold">
                A
              </div>
            </div>
            <div className="min-w-0">
              <span className="block font-script font-semibold text-xl md:text-[1.35rem] text-white leading-none whitespace-nowrap">
                Chez Andy&apos;s
              </span>
              <span className="block text-[9px] md:text-[10px] text-primary-400/90 leading-none mt-1 tracking-[0.18em] uppercase whitespace-nowrap">
                Grossiste alimentaire · Mayotte
              </span>
            </div>
          </Link>

          {/* Navigation desktop : chaque libelle tient sur une seule ligne */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative whitespace-nowrap px-2.5 lg:px-3.5 py-2 rounded-sm text-[12.5px] lg:text-[13px] font-medium tracking-wide transition-colors ${
                  isActive(link.href)
                    ? 'text-white bg-white/[0.07]'
                    : 'text-stone-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute left-2.5 right-2.5 lg:left-3.5 lg:right-3.5 -bottom-px h-px bg-primary-400" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions droite */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Panier desktop */}
            <Link
              href="/panier"
              className="hidden md:relative md:inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-400 active:scale-95 text-white font-semibold text-sm px-4 py-2.5 rounded-md transition-all shadow-gold"
            >
              <ShoppingCart size={15} />
              Panier
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-primary-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Reserver : mobile top, compense la sortie du lien de la barre basse */}
            <Link
              href="/reservation"
              className="md:hidden inline-flex items-center gap-1.5 bg-primary-500 hover:bg-primary-400 active:scale-95 text-white font-semibold text-xs px-3.5 py-2 rounded-md transition-all shadow-gold"
            >
              <CalendarCheck size={13} />
              Réserver
            </Link>
          </div>
        </div>
      </header>

      {/* Overlay + bottom sheet mobile */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] md:hidden anim-fade-in"
          onClick={() => setSheetOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={`fixed left-0 right-0 z-40 md:hidden transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          sheetOpen ? 'translate-y-0' : 'translate-y-[calc(100%+5rem)]'
        }`}
        style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="mx-3 mb-2 rounded-md bg-primary-900 border border-white/10 shadow-forest overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-primary-400">Menu</span>
            <button
              onClick={() => setSheetOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fermer le menu"
            >
              <X size={16} />
            </button>
          </div>
          <div className="px-3 pb-3">
            {sheetLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSheetOpen(false)}
                className={`flex items-center gap-3 px-3 py-3.5 rounded-md text-sm transition-colors ${
                  link.cta
                    ? 'bg-primary-500 text-white font-semibold shadow-gold mb-1.5'
                    : 'text-stone-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className={link.cta ? 'text-white' : 'text-primary-400'}>{link.icon}</span>
                {link.label}
                <ArrowRight size={14} className="ml-auto opacity-40" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Barre de navigation mobile fixee en bas */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-primary-900 border-t border-white/10 safe-pb shadow-[0_-4px_18px_rgba(6,23,16,0.45)]">
        <div className="grid grid-cols-5 h-16">
          {bottomNav.map(item => {
            const active = !item.external && isActive(item.href)
            const cls = `relative flex flex-col items-center justify-center gap-1 transition-colors ${
              item.whatsapp
                ? 'text-[#25D366] hover:text-[#4be284]'
                : active
                  ? 'text-primary-400'
                  : 'text-stone-500 hover:text-primary-400 active:text-primary-300'
            }`
            const inner = (
              <>
                <span className="relative">
                  {item.icon}
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-primary-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary-500" />}
              </>
            )
            return item.external ? (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className={cls} aria-label="Nous contacter sur WhatsApp">
                {inner}
              </a>
            ) : (
              <Link key={item.href} href={item.href} className={cls}>
                {inner}
              </Link>
            )
          })}

          {/* Burger : ouvre le bottom sheet */}
          <button
            onClick={() => setSheetOpen(o => !o)}
            className={`relative flex flex-col items-center justify-center gap-1 transition-colors ${
              sheetOpen ? 'text-primary-400' : 'text-stone-500 hover:text-primary-400 active:text-primary-300'
            }`}
            aria-label="Menu"
            aria-expanded={sheetOpen}
          >
            {sheetOpen ? <X size={21} /> : <Menu size={21} />}
            <span className="text-[10px] font-medium leading-none">Menu</span>
          </button>
        </div>
      </nav>
    </>
  )
}
