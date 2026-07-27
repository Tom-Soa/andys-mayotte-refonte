import Link from 'next/link'
import { ArrowRight, CheckCircle, Package, CalendarCheck, Store, Users } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Primitives'

export const metadata = {
  title: "À propos, votre grossiste alimentaire à Poroani",
  description: "Découvrez Chez Andy's : grossiste alimentaire à Poroani (Chirongui, Mayotte). Large gamme de produits secs, boissons et épicerie à prix de gros, ouvert aux professionnels comme aux particuliers.",
  alternates: { canonical: '/a-propos' },
}

export default function AProposPage() {
  const chiffres = [
    { valeur: '50+', label: 'références en stock' },
    { valeur: '6j/7', label: 'ouvert du lundi au samedi' },
    { valeur: '30 min', label: 'de créneau de retrait' },
    { valeur: '0 €', label: 'de frais de réservation' },
  ]

  const engagements = [
    { icon: <Package size={18} />, titre: 'Prix de gros, pour tous', texte: "Professionnels ou particuliers, chacun accède aux mêmes prix de gros, sans carte de membre ni minimum d'achat." },
    { icon: <CalendarCheck size={18} />, titre: 'Votre temps est précieux', texte: 'La réservation en ligne prépare votre passage : vous choisissez votre créneau, votre commande vous attend.' },
    { icon: <Store size={18} />, titre: 'Un vrai magasin, une vraie équipe', texte: "Pas d'entrepôt anonyme : un point de vente à Poroani où l'on vous connaît et où l'on vous conseille." },
    { icon: <Users size={18} />, titre: 'Ancrés à Mayotte', texte: "Nous approvisionnons les familles, restaurateurs, doukas et revendeurs de l'île, du sud au nord." },
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* En-tete avec photo */}
      <div className="relative bg-primary-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/site/apropos.jpg')" }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(120deg, rgba(10,38,24,0.93) 0%, rgba(10,38,24,0.78) 60%, rgba(10,38,24,0.62) 100%)' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 md:py-24">
          <span className="section-label on-dark">À propos</span>
          <h1 className="font-serif font-semibold text-white leading-tight mb-5" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.75rem)' }}>
            Andy&apos;s, votre partenaire<br />alimentaire à Mayotte
          </h1>
          <p className="text-stone-300 text-sm md:text-base max-w-xl leading-relaxed">
            Grossiste alimentaire installé à Poroani, sur la commune de Chirongui.
            Notre métier : vous fournir l&apos;essentiel, au prix de gros, sans compliquer votre journée.
          </p>
        </div>
      </div>

      {/* Chiffres cles */}
      <div className="border-b border-stone-100" style={{ background: '#F7F2E8' }}>
        <Stagger className="max-w-5xl mx-auto px-4 py-10 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-8" stagger={0.1}>
          {chiffres.map(c => (
            <StaggerItem key={c.label} className="text-center md:text-left">
              <p className="font-serif font-bold text-primary-800 leading-none" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>{c.valeur}</p>
              <p className="text-stone-500 text-xs md:text-sm mt-1.5">{c.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* Histoire */}
      <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <span className="section-label">Notre histoire</span>
            <h2 className="font-serif font-semibold text-primary-800 leading-tight mb-6" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)' }}>
              Le commerce de gros,<br />version simple
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4 text-sm md:text-base">
              Basé à Poroani, Andy&apos;s approvisionne les professionnels et particuliers
              en produits alimentaires : boissons, épicerie, conserves, céréales.
            </p>
            <p className="text-stone-500 leading-relaxed mb-4 text-sm md:text-base">
              Grâce à la réservation en ligne, préparez votre commande depuis chez vous
              et passez la récupérer au créneau qui vous convient. Sans attente.
            </p>
            <p className="text-stone-500 leading-relaxed text-sm md:text-base">
              Le paiement se fait sur place, à la récupération : espèces ou carte bancaire,
              sans aucun frais en ligne. Une manière de travailler pensée pour la réalité
              du terrain à Mayotte.
            </p>
          </div>
          <div className="relative rounded-md overflow-hidden shadow-card border border-stone-100" style={{ aspectRatio: '4/3' }}>
            <img src="/images/site/hero.jpg" alt="L'entrepôt Chez Andy's à Poroani" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/55 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary-300">Poroani · Chirongui</p>
              <p className="font-serif font-semibold text-lg leading-tight">Notre entrepôt</p>
            </div>
          </div>
        </div>
      </div>

      {/* Engagements : rangees editoriales, pas de grille de cartes */}
      <div className="border-t border-stone-100" style={{ background: '#F7F2E8' }}>
        <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <span className="section-label">Nos engagements</span>
            <h2 className="font-serif font-semibold text-primary-800 leading-tight" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)' }}>
              Ce qui ne change jamais
            </h2>
          </div>
          <Stagger stagger={0.1}>
            {engagements.map((e, i) => (
              <StaggerItem key={e.titre}>
                <div className={`group flex items-start gap-5 py-6 ${i > 0 ? 'border-t border-primary-800/10' : ''}`}>
                  <span className="w-11 h-11 rounded-sm bg-primary-900 text-primary-400 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:-translate-y-1">
                    {e.icon}
                  </span>
                  <div>
                    <h3 className="font-serif font-semibold text-primary-800 text-lg md:text-xl mb-1">{e.titre}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{e.texte}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-20 text-center">
        <h2 className="font-serif font-semibold text-primary-800 mb-4" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)' }}>
          Envie de voir ce que nous avons en stock ?
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
          <Link
            href="/produits"
            className="btn-dark group"
          >
            Voir tout le catalogue
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/contact"
            className="btn-outline"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  )
}
