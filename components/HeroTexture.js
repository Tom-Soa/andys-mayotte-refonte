/*
 * Texture d'arriere-plan du hero.
 * Images generees avec Higgsfield (nano_banana) : papier creme avec motifs
 * dessines main (noix de coco, sacs de jute, palmes, grains de riz), centre
 * volontairement vide pour laisser respirer le titre.
 * Deux versions : paysage sur ordinateur, portrait sur telephone, pour que
 * le motif reste dense et net sans etre etire.
 */
export default function HeroTexture() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Telephone : version portrait */}
      <div
        className="absolute inset-0 bg-cover bg-center md:hidden"
        style={{ backgroundImage: "url('/images/site/hero-texture-mobile.jpg')" }}
      />
      {/* Ordinateur : version paysage */}
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/site/hero-texture.jpg')" }}
      />
      {/* Voile blanc au centre : garantit la lisibilite du titre */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 62% 56% at 50% 42%, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.55) 48%, rgba(255,255,255,0.12) 78%)',
        }}
      />
      {/* Raccord vers le blanc du bas de section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </div>
  )
}
