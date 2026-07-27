import Link from 'next/link'
import { notFound } from 'next/navigation'
import { sql } from '@/lib/db'
import AddToCartButton from '@/components/AddToCartButton'
import ProductCard from '@/components/ProductCard'
import fallbackProducts from '@/data/products.json'
import { ArrowLeft, Tag, Package } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function fetchProduct(id) {
  const rows = await sql`SELECT * FROM products WHERE id = ${id}`.catch(() => null)
  if (rows && rows.length > 0) return Array.isArray(rows) ? rows[0] : rows
  /* Repli sur le catalogue local quand la base n'est pas disponible */
  return fallbackProducts.find(p => String(p.id) === String(id)) || null
}

export async function generateMetadata({ params }) {
  const p = await fetchProduct(params.id)
  if (!p) return { title: 'Produit introuvable' }
  const url = `https://chezandys.com/produits/${p.id}`
  const title = `${p.name} - ${parseFloat(p.price).toFixed(2)} €${p.unit ? ' / ' + p.unit : ''}`
  const description = (p.description || `${p.name} disponible chez Andy's, grossiste alimentaire à Poroani, Mayotte. Réservation en ligne, retrait en magasin.`).slice(0, 160)
  return {
    title,
    description,
    alternates: { canonical: `/produits/${p.id}` },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: p.image ? [{ url: p.image, alt: p.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: p.image ? [p.image] : undefined,
    },
  }
}

export default async function ProductPage({ params }) {
  const p = await fetchProduct(params.id)
  if (!p) notFound()

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://chezandys.com/produits/${p.id}#product`,
    name: p.name,
    description: p.description || `${p.name} - disponible chez Andy's, grossiste alimentaire à Poroani, Mayotte.`,
    image: p.image ? [p.image] : ['https://chezandys.com/logo.png'],
    sku: String(p.id),
    category: p.category || 'Alimentaire',
    brand: { '@type': 'Brand', name: "Chez Andy's" },
    offers: {
      '@type': 'Offer',
      url: `https://chezandys.com/produits/${p.id}`,
      priceCurrency: 'EUR',
      price: parseFloat(p.price).toFixed(2),
      availability: p.available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: "Chez Andy's", url: 'https://chezandys.com' },
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://chezandys.com/' },
      { '@type': 'ListItem', position: 2, name: 'Produits', item: 'https://chezandys.com/produits' },
      { '@type': 'ListItem', position: 3, name: p.name, item: `https://chezandys.com/produits/${p.id}` },
    ],
  }

  const relatedFromDb = await sql`
    SELECT * FROM products
    WHERE category = ${p.category} AND id != ${p.id} AND available = true
    LIMIT 4
  `.catch(() => [])
  const relatedProducts = relatedFromDb.length > 0
    ? relatedFromDb
    : fallbackProducts.filter(x => x.category === p.category && String(x.id) !== String(p.id) && x.available).slice(0, 4)

  const stockBadge = p.available
    ? { label: 'En stock', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-100' }
    : { label: 'Indisponible', cls: 'bg-stone-100 text-stone-500 border border-stone-200' }

  /* Garde-fou : certains champs emoji contiennent du texte parasite */
  const emoji = p.emoji && p.emoji.trim().length <= 4 ? p.emoji.trim() : null
  const stockCount = Number(p.stock)
  const hasStock = Number.isFinite(stockCount) && stockCount > 0

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ── Header breadcrumb ─────────────────────────────────── */}
      <div
        className="relative bg-primary-900 text-white overflow-hidden"
        style={{ paddingTop: '3.5rem', paddingBottom: '3rem' }}
      >
        {/* Grille subtile */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(201,161,74,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,161,74,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 80% at 0% 100%, rgba(201,161,74,0.10) 0%, transparent 60%)'
        }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4">
          {/* Bouton retour */}
          <Link
            href="/produits"
            className="inline-flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm mb-4 group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            Retour aux produits
          </Link>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-400 mb-3" aria-label="Fil d'Ariane">
            <Link href="/" className="hover:text-primary-400 transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/produits" className="hover:text-primary-400 transition-colors">Produits</Link>
            <span>/</span>
            <span className="text-stone-200 font-medium truncate max-w-[200px]">{p.name}</span>
          </nav>

          <h1
            className="font-serif font-semibold text-white leading-tight"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)' }}
          >
            {emoji && <span className="mr-2">{emoji}</span>}
            {p.name}
          </h1>
        </div>
      </div>

      {/* ── Contenu principal ─────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Colonne image ──────────────────────────────────── */}
          <div className="relative">
            <div
              className="relative rounded-md overflow-hidden shadow-card border border-stone-100 bg-white"
              style={{ aspectRatio: '4/3' }}
            >
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-contain p-6"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #F0F7F4 0%, #F7F2E8 100%)' }}
                >
                  {emoji ? (
                    <span style={{ fontSize: '8rem', lineHeight: 1 }}>{emoji}</span>
                  ) : (
                    <span className="text-8xl opacity-10">📦</span>
                  )}
                </div>
              )}

              {/* Badge promo */}
              {p.promo && p.available && (
                <span className="absolute top-3 right-3 text-xs font-bold bg-terra-500 text-white px-3 py-1.5 rounded-full tracking-widest uppercase shadow-sm"
                      style={{ background: '#C0392B' }}>
                  Promo
                </span>
              )}
            </div>

            {/* Badge stock sous l'image */}
            <div className="mt-3 flex items-center gap-2">
              <Package size={14} className="text-stone-400" />
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${stockBadge.cls}`}>
                {stockBadge.label}
              </span>
            </div>
          </div>

          {/* ── Colonne infos ──────────────────────────────────── */}
          <div className="flex flex-col">

            {/* Catégorie badge */}
            {p.category && (
              <span className="inline-flex items-center gap-1.5 w-fit text-[10px] font-bold uppercase tracking-widest text-primary-600 mb-3">
                <Tag size={10} />
                {p.category}
              </span>
            )}

            {/* Nom */}
            <h2
              className="font-serif font-semibold text-primary-800 leading-tight mb-4"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
            >
              {emoji && <span className="mr-2">{emoji}</span>}
              {p.name}
            </h2>

            {/* Description */}
            {p.description && (
              <p className="text-stone-500 leading-relaxed text-sm md:text-base mb-6">
                {p.description}
              </p>
            )}

            {/* Prix */}
            <div className="flex items-baseline gap-2 mb-1">
              <span
                className="font-bold text-primary-500"
                style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
              >
                {parseFloat(p.price).toFixed(2)} €
              </span>
              {p.unit && (
                <span className="text-stone-400 text-base">/ {p.unit}</span>
              )}
            </div>

            {p.promo && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full w-fit mb-4">
                Produit en promotion
              </span>
            )}

            <div className="my-6 border-t border-stone-100" />

            {/* Infos pratiques : conditionnement, stock, retrait */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {p.unit && (
                <div className="rounded-md border border-stone-100 bg-stone-50/60 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Conditionnement</p>
                  <p className="text-sm font-semibold text-primary-800 capitalize">Vendu par {p.unit}</p>
                </div>
              )}
              <div className="rounded-md border border-stone-100 bg-stone-50/60 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Disponibilité</p>
                <p className="text-sm font-semibold text-primary-800">
                  {p.available
                    ? hasStock ? `${stockCount} en stock` : 'En stock'
                    : 'Indisponible'}
                </p>
              </div>
              <div className="rounded-md border border-stone-100 bg-stone-50/60 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Retrait</p>
                <p className="text-sm font-semibold text-primary-800">Magasin de Poroani</p>
              </div>
            </div>

            {/* Bouton ajouter au panier */}
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <AddToCartButton product={p} />
              <Link
                href="/reservation"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary-800/60 text-primary-800 hover:bg-primary-800 hover:text-white font-semibold px-6 py-4 rounded-md text-sm transition-all active:scale-95"
              >
                Réserver un créneau
              </Link>
            </div>

            {/* Note paiement */}
            <p className="mt-4 text-xs text-stone-400 leading-relaxed">
              Paiement sur place lors du retrait en magasin à Poroani.
            </p>
          </div>
        </div>

        {/* ── Vous aimerez aussi ────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 md:mt-28">
            <div className="mb-8">
              <span className="section-label">Même catégorie</span>
              <h2
                className="font-serif font-semibold text-primary-800 leading-tight"
                style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)' }}
              >
                Vous aimerez aussi
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
              {relatedProducts.map((prod, i) => (
                <div key={prod.id} className={`reveal delay-${Math.min(i + 1, 5)} h-full`}>
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
