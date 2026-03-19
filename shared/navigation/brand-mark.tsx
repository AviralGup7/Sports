export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 64 64" className="brand-mark-svg">
        <defs>
          <linearGradient id="brand-core" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#8ff7ff" />
            <stop offset="55%" stopColor="#47cbff" />
            <stop offset="100%" stopColor="#ff5e7e" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="23" className="brand-mark-ring" />
        <path d="M20 42 L32 16 L44 42" className="brand-mark-apex" />
        <path d="M24 36 H40" className="brand-mark-crossbar" />
        <circle cx="32" cy="32" r="4.5" className="brand-mark-core" />
      </svg>
      <span className="brand-mark-word">IASL</span>
    </span>
  );
}
