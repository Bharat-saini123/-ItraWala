export function ArchDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-gold/60" />
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M4 24V14C4 8.477 8.477 4 14 4C19.523 4 24 8.477 24 14V24"
          stroke="#BF9B4F"
          strokeWidth="1.4"
        />
        <circle cx="14" cy="14" r="2" fill="#BF9B4F" />
      </svg>
      <span className="h-px w-16 bg-gold/60" />
    </div>
  );
}

/** Larger decorative gateway used behind the hero heading. */
export function GatewayMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 220"
      className={className}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 210V90C20 45.8172 55.8172 10 100 10C144.183 10 180 45.8172 180 90V210"
        stroke="#BF9B4F"
        strokeWidth="2"
      />
      <path
        d="M40 210V95C40 56.9 71.9 25 110 25"
        stroke="#BF9B4F"
        strokeOpacity="0.4"
        strokeWidth="1"
      />
      <path
        d="M160 210V95C160 56.9 128.1 25 90 25"
        stroke="#BF9B4F"
        strokeOpacity="0.4"
        strokeWidth="1"
      />
      <circle cx="100" cy="60" r="3" fill="#BF9B4F" />
    </svg>
  );
}
