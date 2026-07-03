/* Paper-craft decorations shared across pages */

export function Tape({
  className = '',
  rotate = -6,
}: {
  className?: string
  rotate?: number
}) {
  return (
    <div
      aria-hidden
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`absolute h-7 w-24 bg-[#FFE9A8]/85 border-2 border-[#E3C86F]/50
        shadow-[2px_2px_0_0_rgba(43,43,43,0.15)] ${className}`}
    />
  )
}

export function TornEdge({
  fill = '#FBF3E4',
  flip = false,
  className = '',
}: {
  fill?: string
  flip?: boolean
  className?: string
}) {
  return (
    <div
      className={`absolute inset-x-0 ${flip ? 'top-[-1px] rotate-180' : 'bottom-[-1px]'} pointer-events-none ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 1200 36" preserveAspectRatio="none" className="block w-full h-7 sm:h-9">
        <path
          fill={fill}
          d="M0 36 L0 20 L28 26 L55 12 L90 24 L118 10 L150 22 L185 14 L212 25 L248 11 L280 21 L310 9 L345 23 L375 13 L410 24 L442 10 L470 20 L505 14 L538 26 L565 12 L600 22 L632 10 L668 24 L695 14 L730 25 L762 11 L790 20 L825 13 L858 24 L890 10 L920 21 L955 14 L988 25 L1015 12 L1050 23 L1080 11 L1110 21 L1145 13 L1175 24 L1200 16 L1200 36 Z"
        />
      </svg>
    </div>
  )
}
