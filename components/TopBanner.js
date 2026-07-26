import { MapPin, CalendarCheck, Store, CreditCard, Package } from 'lucide-react'

/* Bandeau defilant au-dessus du header : lent, avec icones. */
export default function TopBanner() {
  const items = [
    { icon: <Package size={12} strokeWidth={2.2} />,       text: 'Grossiste alimentaire' },
    { icon: <MapPin size={12} strokeWidth={2.2} />,        text: 'Poroani, Mayotte' },
    { icon: <CalendarCheck size={12} strokeWidth={2.2} />, text: 'Réservation en ligne' },
    { icon: <Store size={12} strokeWidth={2.2} />,         text: 'Retrait en magasin' },
    { icon: <CreditCard size={12} strokeWidth={2.2} />,    text: 'Paiement sur place' },
  ]
  return (
    <div className="bg-primary-500 overflow-hidden py-2 select-none" aria-hidden="true">
      <div className="marquee-track">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center shrink-0">
            {items.map(item => (
              <span
                key={item.text}
                className="inline-flex items-center gap-1.5 px-5 text-white text-[10px] font-semibold tracking-[0.2em] uppercase whitespace-nowrap"
              >
                <span className="opacity-80">{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
