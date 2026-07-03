'use client'

import { useEffect, useState } from 'react'

/* ------------------------------------------------------------------ */
/*  Aurora backdrop — drifting glow blobs + starfield + vignette       */
/* ------------------------------------------------------------------ */

export function AuroraBackground({ fixed = true }: { fixed?: boolean }) {
  return (
    <div className={`${fixed ? 'fixed' : 'absolute'} inset-0 -z-10 overflow-hidden`} aria-hidden>
      <div className="absolute inset-0 bg-[#04070f]" />
      <div className="aurora-a absolute -top-[30%] -left-[15%] w-[70vw] h-[70vw] rounded-full opacity-[0.17]
        bg-[radial-gradient(circle_at_center,#0ea5e9_0%,transparent_60%)] blur-3xl" />
      <div className="aurora-b absolute top-[5%] -right-[20%] w-[65vw] h-[65vw] rounded-full opacity-[0.13]
        bg-[radial-gradient(circle_at_center,#6366f1_0%,transparent_60%)] blur-3xl" />
      <div className="aurora-c absolute -bottom-[35%] left-[15%] w-[75vw] h-[75vw] rounded-full opacity-[0.10]
        bg-[radial-gradient(circle_at_center,#2dd4bf_0%,transparent_60%)] blur-3xl" />
      {/* starfield */}
      <div className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,.55) 0, transparent 100%),' +
            'radial-gradient(1px 1px at 34% 8%, rgba(255,255,255,.4) 0, transparent 100%),' +
            'radial-gradient(1.5px 1.5px at 56% 31%, rgba(186,230,253,.5) 0, transparent 100%),' +
            'radial-gradient(1px 1px at 73% 12%, rgba(255,255,255,.45) 0, transparent 100%),' +
            'radial-gradient(1px 1px at 88% 27%, rgba(255,255,255,.35) 0, transparent 100%),' +
            'radial-gradient(1.5px 1.5px at 22% 44%, rgba(186,230,253,.4) 0, transparent 100%),' +
            'radial-gradient(1px 1px at 65% 52%, rgba(255,255,255,.3) 0, transparent 100%),' +
            'radial-gradient(1px 1px at 43% 67%, rgba(255,255,255,.35) 0, transparent 100%),' +
            'radial-gradient(1.5px 1.5px at 81% 71%, rgba(186,230,253,.35) 0, transparent 100%),' +
            'radial-gradient(1px 1px at 9% 83%, rgba(255,255,255,.3) 0, transparent 100%)',
        }}
      />
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,rgba(4,7,15,0.55)_100%)]" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Snowfall — gentle CSS flakes, generated client-side                */
/* ------------------------------------------------------------------ */

interface Flake {
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
  sway: number
}

export function Snowfall({ zIndex = '-z-[5]', count = 42 }: { zIndex?: string; count?: number }) {
  const [flakes, setFlakes] = useState<Flake[]>([])

  useEffect(() => {
    setFlakes(
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        size: 1.5 + Math.random() * 3.5,
        duration: 9 + Math.random() * 16,
        delay: -Math.random() * 25,
        opacity: 0.25 + Math.random() * 0.55,
        sway: (Math.random() - 0.5) * 160,
      }))
    )
  }, [count])

  return (
    <div className={`fixed inset-0 pointer-events-none ${zIndex}`} aria-hidden>
      {flakes.map((f, i) => (
        <span
          key={i}
          className="snowflake"
          style={{
            left: `${f.left}vw`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            ['--sway' as string]: `${f.sway}px`,
          }}
        />
      ))}
    </div>
  )
}
