export default function BannerArt() {
  return (
    <svg viewBox="0 0 420 330" focusable="false">
            <defs>
              <g id="cop">
                <rect x="34" y="50" width="12" height="16" fill="#D9A27A"/>
                <path d="M0 110 L0 86 Q0 68 22 63 L58 63 Q80 68 80 86 L80 110 Z" fill="#CDB98A"/>
                <path d="M32 63 L40 80 L48 63 Z" fill="#E8DDBB"/>
                <rect x="52" y="82" width="12" height="9" rx="1.500" fill="#B5A06E"/>
                <circle cx="40" cy="40" r="19" fill="#D9A27A"/>
                <path d="M19 33 Q19 9 40 9 Q61 9 61 33 Z" fill="#2A2850"/>
                <rect x="16" y="30" width="48" height="7" rx="3.500" fill="#14133A"/>
                <circle cx="40" cy="21" r="4.200" fill="#FBBF24"/>
              </g>
            </defs>
            <circle cx="255" cy="190" r="150" fill="#FBBF24" opacity="0.10"/>
            <circle cx="255" cy="190" r="115" fill="#FFFFFF" opacity="0.05"/>

            <g transform="rotate(-6 100 80)">
              <text x="14" y="50" fontSize="26" fill="#FFFFFF" style={{fontFamily: "'Yatra One','Noto Serif Devanagari',serif"}}>सही मार्ग</text>
              <text x="14" y="84" fontSize="26" fill="#FFFFFF" style={{fontFamily: "'Yatra One','Noto Serif Devanagari',serif"}}>सही तैयारी</text>
              <text x="14" y="118" fontSize="26" fill="#FBBF24" style={{fontFamily: "'Yatra One','Noto Serif Devanagari',serif"}}>सफल भविष्य</text>
              <path d="M16 134 Q70 126 132 132" stroke="#FBBF24" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </g>

            <use href="#cop" transform="translate(4 188) scale(1.3)"/>
            <use href="#cop" transform="translate(76 176) scale(1.4)"/>
            <use href="#cop" transform="translate(150 192) scale(1.25)"/>

            <g transform="translate(215 70)">
              <rect x="84" y="116" width="32" height="38" rx="10" fill="#D9A27A"/>
              <path d="M0 260 L0 196 Q0 158 44 146 L156 146 Q200 158 200 196 L200 260 Z" fill="#F4F3FB"/>
              <path d="M70 146 L100 192 L130 146 Z" fill="#CFCDE8"/>
              <ellipse cx="100" cy="84" rx="38" ry="44" fill="#E2AB82"/>
              <circle cx="62" cy="90" r="8" fill="#E2AB82"/>
              <circle cx="138" cy="90" r="8" fill="#E2AB82"/>
              <path d="M60 80 Q56 34 100 32 Q144 34 140 80 Q130 54 100 56 Q70 54 60 80 Z" fill="#1F1B2E"/>
              <path d="M82 150 L100 208 L118 150" stroke="#F59E0B" strokeWidth="4" fill="none"/>
              <rect x="87" y="206" width="26" height="32" rx="4" fill="#FBBF24"/>
              <rect x="93" y="214" width="14" height="4" rx="2" fill="#1B1A45"/>
              <rect x="93" y="222" width="14" height="4" rx="2" fill="#1B1A45" opacity="0.6"/>
            </g>

            <path transform="translate(396 60)" d="M0 -13 Q0 0 13 0 Q0 0 0 13 Q0 0 -13 0 Q0 0 0 -13Z" fill="#FBBF24"/>
            <path transform="translate(190 150)" d="M0 -8 Q0 0 8 0 Q0 0 0 8 Q0 0 -8 0 Q0 0 0 -8Z" fill="#FFFFFF" opacity="0.8"/>
          </svg>
  );
}
