/* Bandeau defilant place au-dessus du header (non sticky, il disparait au scroll) */
export default function TopBanner() {
  const text = "Grossiste alimentaire · Poroani, Mayotte · Réservation en ligne · Retrait en magasin · Paiement sur place · "
  return (
    <div className="bg-primary-500 overflow-hidden py-2 select-none" aria-hidden="true">
      <div className="marquee-track">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="px-6 text-white text-[10px] font-semibold tracking-[0.22em] uppercase whitespace-nowrap opacity-95"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
