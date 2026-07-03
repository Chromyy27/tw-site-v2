'use client'

import { useEffect, useState } from 'react'

/* ------------------------------------------------------------------ */
/*  Snowfall — paper confetti flakes, generated client-side            */
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
        size: 3 + Math.random() * 5,
        duration: 10 + Math.random() * 16,
        delay: -Math.random() * 26,
        opacity: 0.5 + Math.random() * 0.45,
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
