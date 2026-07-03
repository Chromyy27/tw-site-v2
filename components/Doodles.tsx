/* Hand-drawn doodle decorations — stroke follows currentColor */

export function ScribbleUnderline({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 16" fill="none" className={`block ${className}`} aria-hidden>
      <path
        d="M4 10 C 28 4, 52 13, 78 8 C 104 3, 122 12, 148 9 C 170 6.5, 192 11, 216 7"
        stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"
      />
      <path
        d="M14 14 C 40 9, 70 15, 98 12"
        stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.55"
      />
    </svg>
  )
}

/** Curvy arrow pointing down-right. Mirror/rotate with classes. */
export function DoodleArrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 90" fill="none" className={`block ${className}`} aria-hidden>
      <path d="M10 8 C 26 42, 56 64, 96 72" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M96 72 L78 70 M96 72 L88 56" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

/** Curvy arrow pointing left. */
export function DoodleArrowLeft({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" fill="none" className={`block ${className}`} aria-hidden>
      <path d="M112 10 C 84 38, 46 48, 12 42" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M12 42 L28 32 M12 42 L30 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

/** Rough crayon circle for ringing something important. Fills its container. */
export function DoodleCircle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 70" fill="none" preserveAspectRatio="none" className={`absolute inset-0 w-full h-full ${className}`} aria-hidden>
      <path
        d="M28 12 C 60 2, 118 4, 142 18 C 162 30, 150 52, 118 60 C 84 68, 26 64, 12 48 C 0 34, 16 16, 48 9"
        stroke="currentColor" strokeWidth="4" strokeLinecap="round"
      />
    </svg>
  )
}

export function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`block ${className}`} aria-hidden>
      <path d="M12 2 C 12.8 7.5, 13.5 9, 22 12 C 13.5 15, 12.8 16.5, 12 22 C 11.2 16.5, 10.5 15, 2 12 C 10.5 9, 11.2 7.5, 12 2 Z"
        fill="currentColor" stroke="#2B2B2B" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

export function SpeechBubble({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative bg-white border-[3px] border-ink wobbly-sm px-3.5 py-1.5
      font-hand text-[17px] leading-tight text-ink shadow-[3px_3px_0_0_#2B2B2B] ${className}`}>
      {children}
      <span className="absolute -bottom-[9px] left-6 w-3.5 h-3.5 bg-white border-b-[3px] border-r-[3px] border-ink rotate-45" aria-hidden />
    </div>
  )
}

/** Paper-doll barbarian mascot — wild hair, big mustache, zero patience. */
export function Barbarian({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`block ${className}`} aria-hidden>
      {/* hair spikes */}
      <path
        d="M20 44 L12 20 L30 33 L37 10 L48 28 L58 8 L67 28 L82 14 L77 36 L92 30 L82 48 Z"
        fill="#FFD95E" stroke="#2B2B2B" strokeWidth="4" strokeLinejoin="round"
      />
      {/* face */}
      <circle cx="50" cy="60" r="25" fill="#FFD9B0" stroke="#2B2B2B" strokeWidth="4" />
      {/* angry brows */}
      <path d="M35 53 L46 50 M54 50 L65 53" stroke="#2B2B2B" strokeWidth="4" strokeLinecap="round" />
      {/* eyes */}
      <circle cx="41.5" cy="58.5" r="2.7" fill="#2B2B2B" />
      <circle cx="58.5" cy="58.5" r="2.7" fill="#2B2B2B" />
      {/* nose */}
      <path d="M50 60 C 48.5 63, 48.5 65, 50 66.5" stroke="#2B2B2B" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* mighty mustache */}
      <path
        d="M32 70 C 39 63.5, 46 64, 50 68 C 54 64, 61 63.5, 68 70 C 64 78.5, 55 79, 50 74.5 C 45 79, 36 78.5, 32 70 Z"
        fill="#C98A3B" stroke="#2B2B2B" strokeWidth="3.5" strokeLinejoin="round"
      />
    </svg>
  )
}
