/* FAQ partagee : la page d'accueil affiche les 4 premieres,
   la page /faq affiche tout. */
export const faqItems = [
  {
    q: "Comment passer commande chez Andy's ?",
    a: "Parcourez le catalogue sur la page Produits, ajoutez les articles à votre panier, puis choisissez un créneau de retrait via la page Réservation. Vous recevrez une confirmation par email. Aucun paiement en ligne : tout se règle en magasin lors du retrait."
  },
  {
    q: "Quels sont les modes de paiement acceptés ?",
    a: "Espèces et carte bancaire sont acceptées en magasin lors du retrait. Aucun paiement n'est demandé en ligne au moment de la réservation."
  },
  {
    q: "Faut-il être professionnel pour acheter ?",
    a: "Non, particuliers et professionnels peuvent réserver et acheter. Andy's est un grossiste ouvert à tous, idéal pour les courses en gros, les familles nombreuses, les événements ou les revendeurs."
  },
  {
    q: "Faites-vous de la livraison ?",
    a: "Non, le modèle Andy's est uniquement basé sur le retrait en magasin à Poroani. Cela permet de proposer des prix de gros sans frais cachés."
  },
  {
    q: "Où se trouve le magasin ?",
    a: "Andy's est situé à Poroani, sur la commune de Chirongui (97620), à Mayotte. Pour l'itinéraire, consultez la page contact."
  },
  {
    q: "Combien de temps à l'avance dois-je réserver ?",
    a: "La réservation s'effectue sur des créneaux de 30 minutes, du lundi au samedi. Réservez idéalement la veille pour être sûr d'avoir le créneau qui vous arrange. Les réservations le jour même sont possibles selon disponibilité."
  },
  {
    q: "Que se passe-t-il si je ne viens pas récupérer ma réservation ?",
    a: "Aucun engagement financier puisque le paiement se fait en magasin. Toutefois, prévenez-nous si vous ne pouvez pas venir afin que nous puissions libérer le créneau pour un autre client."
  },
  {
    q: "Le stock affiché en ligne est-il à jour ?",
    a: "Oui, le catalogue et la disponibilité des produits sont mis à jour en temps réel par notre équipe. Si un article apparaît disponible au moment de la réservation, il est garanti pour vous lors du retrait."
  },
]

export function faqJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}
