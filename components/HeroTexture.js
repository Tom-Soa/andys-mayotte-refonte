/*
 * Texture d'arriere-plan du hero, dessinee en SVG.
 * Motif organique tres pale evoquant l'univers du grossiste tropical :
 * grains de riz, demi-noix de coco, nervures de feuille, tissage de sac
 * de jute. Aucun fichier image a charger, net a toute resolution.
 */
export default function HeroTexture() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Tissage de jute, tres discret */}
          <pattern id="jute" width="7" height="7" patternUnits="userSpaceOnUse">
            <path d="M0 3.5h7M3.5 0v7" stroke="#143D2C" strokeWidth="0.5" opacity="0.055" />
          </pattern>

          {/* Semis de grains de riz orientes */}
          <pattern id="grains" width="120" height="120" patternUnits="userSpaceOnUse">
            <g fill="#8B6225" opacity="0.075">
              <ellipse cx="18" cy="26" rx="5.5" ry="2.1" transform="rotate(-24 18 26)" />
              <ellipse cx="74" cy="14" rx="5.5" ry="2.1" transform="rotate(38 74 14)" />
              <ellipse cx="103" cy="58" rx="5.5" ry="2.1" transform="rotate(-12 103 58)" />
              <ellipse cx="46" cy="70" rx="5.5" ry="2.1" transform="rotate(62 46 70)" />
              <ellipse cx="88" cy="98" rx="5.5" ry="2.1" transform="rotate(-48 88 98)" />
              <ellipse cx="12" cy="104" rx="5.5" ry="2.1" transform="rotate(16 12 104)" />
            </g>
          </pattern>

          {/* Estompage radial : le motif s'efface au centre et sur les bords */}
          <radialGradient id="fadeCenter" cx="50%" cy="42%" r="62%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="42%" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="softMask">
            <rect width="1200" height="700" fill="url(#fadeCenter)" />
          </mask>
          <mask id="edgeMask">
            <linearGradient id="edgeFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0" />
              <stop offset="35%" stopColor="#fff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#fff" stopOpacity="1" />
            </linearGradient>
            <rect width="1200" height="700" fill="url(#edgeFade)" />
          </mask>
        </defs>

        {/* Fond creme tres pale */}
        <rect width="1200" height="700" fill="#FDFCF9" />

        {/* Tissage sur toute la surface, efface au centre */}
        <g mask="url(#softMask)">
          <rect width="1200" height="700" fill="url(#jute)" />
        </g>

        {/* Grains de riz, plus presents vers le bas */}
        <g mask="url(#edgeMask)">
          <rect width="1200" height="700" fill="url(#grains)" />
        </g>

        {/* Grandes nervures de feuille tropicale, en filigrane */}
        <g stroke="#2E8060" fill="none" opacity="0.09" strokeLinecap="round">
          <path d="M-40 610 C 180 560, 330 470, 430 330" strokeWidth="1.6" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
            const t = i / 7
            const x = -40 + t * 470
            const y = 610 - t * 280 - t * t * 20
            return (
              <path
                key={`l-${i}`}
                d={`M${x} ${y} l ${34 - t * 10} ${-46 + t * 12}`}
                strokeWidth="1"
              />
            )
          })}
        </g>
        <g stroke="#2E8060" fill="none" opacity="0.07" strokeLinecap="round">
          <path d="M1240 90 C 1030 130, 900 215, 820 330" strokeWidth="1.6" />
          {[0, 1, 2, 3, 4, 5, 6].map(i => {
            const t = i / 6
            const x = 1240 - t * 420
            const y = 90 + t * 240 + t * t * 14
            return (
              <path
                key={`r-${i}`}
                d={`M${x} ${y} l ${-32 + t * 8} ${40 - t * 10}`}
                strokeWidth="1"
              />
            )
          })}
        </g>

        {/* Demi-noix de coco stylisees, en tres pale */}
        <g opacity="0.075">
          <g transform="translate(148 168) rotate(-12)">
            <circle r="52" fill="none" stroke="#8B6225" strokeWidth="1.8" />
            <circle r="34" fill="none" stroke="#8B6225" strokeWidth="1.1" />
            <path d="M-34 0 A 34 34 0 0 0 34 0" fill="#8B6225" opacity="0.32" />
          </g>
          <g transform="translate(1046 552) rotate(18)">
            <circle r="64" fill="none" stroke="#8B6225" strokeWidth="1.8" />
            <circle r="42" fill="none" stroke="#8B6225" strokeWidth="1.1" />
            <path d="M-42 0 A 42 42 0 0 1 42 0" fill="#8B6225" opacity="0.28" />
          </g>
        </g>

        {/* Halo dore diffus, tres leger */}
        <ellipse cx="960" cy="120" rx="300" ry="200" fill="#C9A14A" opacity="0.05" />
        <ellipse cx="180" cy="600" rx="280" ry="180" fill="#2E8060" opacity="0.04" />
      </svg>

      {/* Voile blanc au centre : garantit la lisibilite du titre */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 58% 52% at 50% 40%, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.72) 45%, rgba(255,255,255,0) 78%)',
        }}
      />
    </div>
  )
}
