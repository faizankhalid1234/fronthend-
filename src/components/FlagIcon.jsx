function FlagIcon({ code, className = "" }) {
  if (code === "en") {
    return (
      <span
        className={`inline-flex shrink-0 overflow-hidden rounded-[4px] shadow-sm ring-1 ring-black/10 ${className}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 60 40" className="h-full w-full">
          <rect width="60" height="40" fill="#012169" />
          <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" strokeWidth="8" />
          <path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" strokeWidth="4" />
          <path d="M30 0 V40 M0 20 H60" stroke="#fff" strokeWidth="12" />
          <path d="M30 0 V40 M0 20 H60" stroke="#C8102E" strokeWidth="6" />
        </svg>
      </span>
    );
  }

  if (code === "ar") {
    return (
      <span
        className={`inline-flex shrink-0 overflow-hidden rounded-[4px] shadow-sm ring-1 ring-black/10 ${className}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 60 40" className="h-full w-full">
          <rect width="60" height="40" fill="#006C35" />
          <path
            d="M10 20 C14 16 18 16 22 20 C18 24 14 24 10 20 Z M22 20 H34"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M36 14 C40 14 42 17 42 20 C42 23 40 26 36 26"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="8" y="11" width="2.5" height="18" rx="1" fill="#fff" />
        </svg>
      </span>
    );
  }

  return null;
}

export default FlagIcon;
