export default function JoinArt() {
  return (
    <svg viewBox="0 0 220 150" focusable="false">
            <rect x="12" y="104" width="56" height="36" rx="4" className="g-surface"/>
            <rect x="12" y="104" width="56" height="36" rx="4" className="g-stroke-line" strokeWidth="2"/>
            <text x="40" y="126" fontSize="9.500" fontWeight="800" textAnchor="middle" className="g-muted">Practise</text>
            <rect x="72" y="76" width="56" height="64" rx="4" className="g-surface"/>
            <rect x="72" y="76" width="56" height="64" rx="4" className="g-stroke-line" strokeWidth="2"/>
            <text x="100" y="112" fontSize="9.500" fontWeight="800" textAnchor="middle" className="g-muted">Mock test</text>
            <rect x="132" y="46" width="56" height="94" rx="4" className="g-brand"/>
            <text x="160" y="98" fontSize="9.500" fontWeight="800" textAnchor="middle" className="g-on-brand">Selected</text>
            <line x1="160" y1="46" x2="160" y2="14" className="g-stroke-ink" strokeWidth="3" strokeLinecap="round"/>
            <path d="M162 15 L190 24 L162 34 Z" className="g-accent"/>
            <path transform="translate(30 60)" d="M0 -10 Q0 0 10 0 Q0 0 0 10 Q0 0 -10 0 Q0 0 0 -10Z" className="g-accent"/>
            <path transform="translate(202 74)" d="M0 -7 Q0 0 7 0 Q0 0 0 7 Q0 0 -7 0 Q0 0 0 -7Z" className="g-brand"/>
            <line x1="6" y1="141" x2="214" y2="141" className="g-stroke-ink" strokeWidth="2" strokeLinecap="round"/>
          </svg>
  );
}
