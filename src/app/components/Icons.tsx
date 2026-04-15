type IconProps = {
  className?: string;
};

const base = "w-4 h-4";

export function BedIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 18V8" />
      <path d="M2 14h20v4" />
      <path d="M22 14v-3a3 3 0 0 0-3-3h-9v6" />
      <circle cx="6" cy="11.5" r="1.8" />
    </svg>
  );
}

export function BathIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" />
      <path d="M5 12V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1" />
      <path d="M6 19l-1 2" />
      <path d="M18 19l1 2" />
    </svg>
  );
}

export function PersonIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c.8-3.8 4-6 7.5-6s6.7 2.2 7.5 6" />
    </svg>
  );
}

export function ClockIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function ArrowRight({ className = "" }: IconProps) {
  return (
    <svg
      className={`w-3.5 h-3.5 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12h16" />
      <path d="M14 6l6 6-6 6" />
    </svg>
  );
}

export function MountainIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 19l6-9 4 6 2-3 6 6z" />
      <circle cx="17.5" cy="6.5" r="1.4" />
    </svg>
  );
}

export function CliffIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 17l4-7 4 5 3-3 7 5" />
      <path d="M3 21h18" />
      <path d="M16 21c.8-1.2 2.2-1.2 3 0" opacity="0.6" />
      <path d="M5 21c.8-1.2 2.2-1.2 3 0" opacity="0.6" />
    </svg>
  );
}

export function WaveIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 9c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
      <path d="M2 14c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" opacity="0.7" />
      <path d="M2 19c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" opacity="0.4" />
    </svg>
  );
}

export function FishIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12c3-5 8-5 12 0-4 5-9 5-12 0z" />
      <path d="M15 12l5-3v6z" />
      <circle cx="7" cy="11" r="0.8" fill="currentColor" />
      <path d="M3 16c1 0 1-1 2-1" opacity="0.6" />
    </svg>
  );
}

export function ShipIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={`${base} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 17h18l-2 4H5z" />
      <path d="M5 17V9h14v8" />
      <path d="M12 5v4" />
      <path d="M9 9l3-4 3 4" />
    </svg>
  );
}

export function MarkLogo({ className = "" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="24" cy="18" r="6" />
      <path d="M6 32 Q 14 28 22 32 T 38 32 T 54 32" />
      <path d="M6 38 Q 14 34 22 38 T 38 38 T 54 38" opacity="0.6" />
    </svg>
  );
}
