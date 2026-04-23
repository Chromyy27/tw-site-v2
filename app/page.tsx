'use client'

import { useEffect, useRef, useState } from 'react'

function useMounted() {
  const [m, setM] = useState(false)
  useEffect(() => setM(true), [])
  return m
}

function useCursor() {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 })
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      setPos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return pos
}

function useScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setP(Math.min(1, Math.max(0, window.scrollY / (h || 1))))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return p
}

function CursorAurora() {
  const mounted = useMounted()
  const cursor = useCursor()
  if (!mounted) return null
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-500"
      style={{
        background: `radial-gradient(600px circle at ${cursor.x * 100}% ${cursor.y * 100}%, rgba(124,92,255,0.18), transparent 55%), radial-gradient(900px circle at ${(1 - cursor.x) * 100}% ${(1 - cursor.y) * 100}%, rgba(255,138,108,0.10), transparent 60%)`,
      }}
    />
  )
}

function FixedAtmosphere() {
  const p = useScrollProgress()
  // Three atmospheric "hours": dawn (violet/coral), noon (amber/rose), dusk (violet-cyan)
  const stops = [
    { bg1: '#0b0420', bg2: '#2a0a3e', a1: 'rgba(124,92,255,0.55)', a2: 'rgba(255,138,108,0.35)', a3: 'rgba(125,226,226,0.20)' },
    { bg1: '#120630', bg2: '#4a0a33', a1: 'rgba(255,138,108,0.45)', a2: 'rgba(255,111,168,0.35)', a3: 'rgba(255,207,122,0.25)' },
    { bg1: '#060218', bg2: '#1a0433', a1: 'rgba(74,47,191,0.55)', a2: 'rgba(125,226,226,0.25)', a3: 'rgba(255,111,168,0.22)' },
  ]
  const idx = p < 0.5 ? 0 : p < 0.82 ? 1 : 2
  const s = stops[idx]
  return (
    <div className="pointer-events-none fixed inset-0 z-0 transition-colors duration-[1800ms]">
      <div
        className="absolute inset-0 transition-[background] duration-[1800ms]"
        style={{ background: `linear-gradient(180deg, ${s.bg1} 0%, ${s.bg2} 100%)` }}
      />
      <div
        className="absolute -top-40 -left-40 w-[820px] h-[820px] rounded-full blur-[120px] transition-colors duration-[1800ms]"
        style={{ background: s.a1 }}
      />
      <div
        className="absolute top-1/3 -right-40 w-[700px] h-[700px] rounded-full blur-[120px] transition-colors duration-[1800ms]"
        style={{ background: s.a2 }}
      />
      <div
        className="absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full blur-[120px] transition-colors duration-[1800ms]"
        style={{ background: s.a3 }}
      />
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  )
}

function Reveal({
  children,
  delay = 0,
  className = '',
  as: As = 'div',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  as?: keyof JSX.IntrinsicElements
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            setVis(true)
            io.disconnect()
          }
        })
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <As
      // @ts-expect-error dynamic ref
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 1.2s cubic-bezier(.2,.7,.1,1) ${delay}ms, transform 1.4s cubic-bezier(.2,.7,.1,1) ${delay}ms`,
      }}
    >
      {children}
    </As>
  )
}

function Sun() {
  return (
    <div className="relative w-[420px] h-[420px] md:w-[560px] md:h-[560px] flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(255,207,122,0.9) 0%, rgba(255,138,108,0.6) 22%, rgba(255,111,168,0.35) 45%, rgba(124,92,255,0.15) 72%, transparent 85%)',
          filter: 'blur(8px)',
          animation: 'sun-pulse 10s ease-in-out infinite',
        }}
      />
      <div
        className="relative w-[240px] h-[240px] md:w-[300px] md:h-[300px] rounded-full"
        style={{
          background:
            'radial-gradient(circle at 30% 28%, #fff4dc 0%, #ffcf7a 18%, #ff8a6c 42%, #c74c84 70%, #4a2fbf 100%)',
          boxShadow:
            '0 0 120px 20px rgba(255,138,108,0.45), inset 0 0 80px 0 rgba(255,255,255,0.15)',
        }}
      />
      <div
        className="absolute inset-0 rounded-full mix-blend-screen pointer-events-none"
        style={{
          background:
            'conic-gradient(from 0deg, rgba(255,207,122,0.15), rgba(124,92,255,0.15), rgba(125,226,226,0.15), rgba(255,111,168,0.15), rgba(255,207,122,0.15))',
          animation: 'sun-spin 40s linear infinite',
          filter: 'blur(40px)',
        }}
      />
      <style jsx>{`
        @keyframes sun-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes sun-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

function Waveline() {
  return (
    <svg viewBox="0 0 1200 120" className="w-full h-[80px] md:h-[120px]" aria-hidden>
      <defs>
        <linearGradient id="wv" x1="0" x2="1">
          <stop offset="0%" stopColor="#7c5cff" />
          <stop offset="35%" stopColor="#ff8a6c" />
          <stop offset="65%" stopColor="#ffcf7a" />
          <stop offset="100%" stopColor="#7de2e2" />
        </linearGradient>
      </defs>
      {[0, 1, 2].map(i => (
        <path
          key={i}
          d="M0,60 C150,20 300,100 450,60 C600,20 750,100 900,60 C1050,20 1200,100 1200,60"
          fill="none"
          stroke="url(#wv)"
          strokeWidth={1 + i * 0.6}
          opacity={0.35 - i * 0.08}
          style={{
            animation: `wv ${10 + i * 2}s ease-in-out ${i * 0.4}s infinite alternate`,
            transformOrigin: 'center',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes wv {
          from { transform: translateX(0) scaleY(1); }
          to   { transform: translateX(-60px) scaleY(1.35); }
        }
      `}</style>
    </svg>
  )
}

function Nav() {
  return (
    <header className="relative z-30">
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group">
          <span
            className="w-6 h-6 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, #ffcf7a, #ff8a6c 40%, #7c5cff 90%)',
              boxShadow: '0 0 20px rgba(255,138,108,0.7)',
            }}
          />
          <span className="text-[15px] tracking-[0.22em] uppercase font-light text-white/90">
            Dawnline
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-10 text-[13px] text-white/55 tracking-wide">
          <a href="#arc" className="hover:text-white transition-colors">The Day</a>
          <a href="#rooms" className="hover:text-white transition-colors">Rooms</a>
          <a href="#pricing" className="hover:text-white transition-colors">Membership</a>
        </nav>
        <a
          href="#begin"
          className="group relative inline-flex items-center gap-2 rounded-full pl-4 pr-2 py-1.5 text-[13px] text-white/90 ring-1 ring-white/15 hover:ring-white/40 backdrop-blur transition"
        >
          Begin at dawn
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[#0b0420]"
            style={{
              background:
                'linear-gradient(135deg, #ffcf7a, #ff8a6c 50%, #ff6fa8)',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>
        </a>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="relative z-10 pt-10 md:pt-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="relative grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-6 items-center min-h-[78vh]">
          <Reveal>
            <div className="max-w-xl">
              <p className="text-[12px] tracking-[0.32em] uppercase text-white/55 mb-8">
                A composition for the hour you&rsquo;re in
              </p>
              <h1
                className="font-light leading-[0.95] tracking-[-0.02em] text-white"
                style={{
                  fontSize: 'clamp(48px, 8vw, 112px)',
                }}
              >
                Listen to
                <br />
                <span
                  style={{
                    background:
                      'linear-gradient(100deg, #ffcf7a 0%, #ff8a6c 28%, #ff6fa8 55%, #7c5cff 80%, #7de2e2 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  the day.
                </span>
              </h1>
              <p className="mt-8 text-[17px] md:text-[18px] leading-relaxed text-white/65 max-w-md">
                A slow, generative soundscape composed in real time from the light outside your window,
                the room you&rsquo;re sitting in, and the quiet you&rsquo;re trying to keep.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#begin"
                  className="group relative inline-flex items-center gap-3 rounded-full pl-6 pr-2 py-2 text-[14px] font-medium text-[#0b0420] shadow-[0_20px_80px_-20px_rgba(255,138,108,0.8)]"
                  style={{
                    background:
                      'linear-gradient(115deg, #ffe1a8 0%, #ffcf7a 28%, #ff8a6c 55%, #ff6fa8 88%)',
                  }}
                >
                  Begin listening
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#0b0420]/90 text-white">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </span>
                </a>
                <a
                  href="#arc"
                  className="text-[14px] text-white/65 hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  <span
                    className="w-8 h-8 rounded-full ring-1 ring-white/20 inline-flex items-center justify-center"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>
                  </span>
                  See how the day moves
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={180} className="relative flex justify-center md:justify-end">
            <Sun />
          </Reveal>
        </div>

        <div className="mt-8 md:mt-4">
          <Waveline />
        </div>
      </div>
    </section>
  )
}

function ArcSection() {
  const hours = [
    {
      label: '04:40',
      name: 'Before light',
      body: 'Low strings and held breath. The rooms are still asleep; the piece begins at the edge of waking.',
      grad: 'from-[#2a0a3e] via-[#4a2fbf] to-[#7c5cff]',
    },
    {
      label: '09:12',
      name: 'First hour',
      body: 'Woodwinds thin as linen. Coral bleeds into the upper register and a slow rhythm enters from somewhere behind you.',
      grad: 'from-[#4a2fbf] via-[#ff6fa8] to-[#ffcf7a]',
    },
    {
      label: '14:55',
      name: 'Midday',
      body: 'Open air, sustained warmth. The composition holds — an even plain the day can travel across.',
      grad: 'from-[#ffcf7a] via-[#ff8a6c] to-[#ff6fa8]',
    },
    {
      label: '21:30',
      name: 'Deepening',
      body: 'The palette cools. Reverb lengthens. Everything is about to be quieter than it is now.',
      grad: 'from-[#ff6fa8] via-[#7c5cff] to-[#7de2e2]',
    },
  ]
  return (
    <section id="arc" className="relative z-10 py-32 md:py-48">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-[12px] tracking-[0.32em] uppercase text-white/55 mb-5">The arc</p>
            <h2
              className="font-light tracking-[-0.02em] text-white"
              style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.05 }}
            >
              One long composition,
              <br />
              <span className="text-white/55">quietly rewritten</span>
              <br />
              as the hours pass.
            </h2>
          </div>
        </Reveal>

        <div className="mt-20 grid md:grid-cols-2 gap-x-10 gap-y-20">
          {hours.map((h, i) => (
            <Reveal key={h.label} delay={i * 120}>
              <article className="group relative">
                <div
                  className={`h-56 rounded-3xl bg-gradient-to-br ${h.grad} overflow-hidden relative`}
                  style={{
                    boxShadow: '0 30px 120px -40px rgba(0,0,0,0.6)',
                  }}
                >
                  <div
                    className="absolute inset-0 mix-blend-overlay opacity-70"
                    style={{
                      background:
                        'radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.55), transparent 55%)',
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(ellipse at 20% 80%, rgba(0,0,0,0.5), transparent 55%)',
                    }}
                  />
                  <div className="absolute top-5 left-5 text-[11px] tracking-[0.3em] uppercase text-white/70">
                    {h.label}
                  </div>
                </div>
                <div className="mt-6">
                  <div className="text-[13px] tracking-[0.22em] uppercase text-white/50">{h.name}</div>
                  <p className="mt-3 text-white/80 text-[16px] leading-relaxed max-w-md">{h.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Rooms() {
  const rooms = [
    {
      title: 'A room to work in',
      body: 'A held chord for focus. Motion that never announces itself. Minutes that feel like they belong to you.',
      swatch: 'linear-gradient(135deg, #3a1360 0%, #7c5cff 70%, #c9b8ff 100%)',
    },
    {
      title: 'A room to come home to',
      body: 'The piece softens with the windows. Warmth gathers in the low end, the way a room fills with the smell of something cooking.',
      swatch: 'linear-gradient(135deg, #ff8a6c 0%, #ff6fa8 55%, #ffcf7a 100%)',
    },
    {
      title: 'A room to sleep in',
      body: 'Nothing asks for your attention. The composition thins across hours, the last notes falling somewhere below hearing.',
      swatch: 'linear-gradient(135deg, #0b0420 0%, #2a0a3e 55%, #7de2e2 100%)',
    },
  ]
  return (
    <section id="rooms" className="relative z-10 py-24 md:py-40">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <Reveal>
          <div className="grid md:grid-cols-[1fr_1.3fr] gap-8 mb-16">
            <div>
              <p className="text-[12px] tracking-[0.32em] uppercase text-white/55 mb-5">Rooms</p>
              <h2
                className="font-light tracking-[-0.02em]"
                style={{ fontSize: 'clamp(32px, 4vw, 52px)', lineHeight: 1.05 }}
              >
                Designed not for the ear
                <br />
                <span className="text-white/55">but for the space.</span>
              </h2>
            </div>
            <p className="text-white/60 text-[16px] leading-relaxed md:pt-6 max-w-lg">
              Choose a room and the composition adapts — to your hour, your weather, your own unhurried tempo.
              Nothing repeats. Nothing asks to be noticed. The music becomes part of the architecture.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {rooms.map((r, i) => (
            <Reveal key={r.title} delay={i * 140}>
              <div
                className="group relative rounded-3xl p-[1px] overflow-hidden"
                style={{ background: r.swatch }}
              >
                <div className="relative rounded-[23px] bg-[#0b0420]/75 backdrop-blur-xl p-7 h-full">
                  <div
                    className="w-14 h-14 rounded-2xl mb-8"
                    style={{
                      background: r.swatch,
                      boxShadow: '0 20px 60px -20px rgba(124,92,255,0.6)',
                    }}
                  />
                  <h3 className="text-[22px] font-light tracking-tight text-white leading-tight">
                    {r.title}
                  </h3>
                  <p className="mt-4 text-white/60 text-[14.5px] leading-relaxed">{r.body}</p>
                  <div className="mt-8 flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-white/50 group-hover:text-white/80 transition-colors">
                    Listen in
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Quote() {
  return (
    <section className="relative z-10 py-28 md:py-40">
      <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
        <Reveal>
          <svg width="44" height="36" viewBox="0 0 44 36" className="mx-auto mb-10 opacity-40" aria-hidden>
            <path
              d="M0 36V20C0 10 6 2 18 0l2 6C12 8 8 12 8 18h10v18H0zm24 0V20C24 10 30 2 42 0l2 6c-8 2-12 6-12 12h10v18H24z"
              fill="url(#qg)"
            />
            <defs>
              <linearGradient id="qg" x1="0" x2="1">
                <stop stopColor="#ffcf7a" />
                <stop offset="0.5" stopColor="#ff6fa8" />
                <stop offset="1" stopColor="#7de2e2" />
              </linearGradient>
            </defs>
          </svg>
          <blockquote
            className="font-light tracking-[-0.01em] text-white/95"
            style={{ fontSize: 'clamp(24px, 3.2vw, 40px)', lineHeight: 1.25 }}
          >
            &ldquo;It&rsquo;s the first piece of software I&rsquo;ve used that I&rsquo;ve described,
            without irony, as having <em className="not-italic text-[#ffcf7a]">weather</em>.&rdquo;
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-4 text-[12px] tracking-[0.28em] uppercase text-white/55">
            <span
              className="w-10 h-10 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, #ffcf7a, #ff8a6c 50%, #7c5cff 100%)',
              }}
            />
            Noa Amari · Composer, Lisbon
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="relative z-10 py-24 md:py-40">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-[12px] tracking-[0.32em] uppercase text-white/55 mb-5">Membership</p>
            <h2
              className="font-light tracking-[-0.02em]"
              style={{ fontSize: 'clamp(32px, 4.2vw, 56px)', lineHeight: 1.05 }}
            >
              One quiet subscription
              <br />
              <span className="text-white/55">for every hour of the year.</span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative max-w-xl mx-auto">
            <div
              className="absolute -inset-px rounded-[32px] opacity-80"
              style={{
                background:
                  'conic-gradient(from 140deg at 50% 50%, #ffcf7a, #ff8a6c, #ff6fa8, #7c5cff, #7de2e2, #ffcf7a)',
                filter: 'blur(18px)',
              }}
              aria-hidden
            />
            <div className="relative rounded-[32px] bg-[#0a0322]/80 backdrop-blur-xl ring-1 ring-white/10 p-10 md:p-12">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-[12px] tracking-[0.28em] uppercase text-white/55">
                    A full year of hours
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span
                      className="font-light tracking-[-0.03em]"
                      style={{
                        fontSize: 'clamp(60px, 7vw, 88px)',
                        background:
                          'linear-gradient(120deg, #ffcf7a, #ff8a6c 40%, #ff6fa8 80%, #7c5cff)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                      }}
                    >
                      $64
                    </span>
                    <span className="text-white/50 text-[15px] font-light">/ year</span>
                  </div>
                </div>
                <div className="text-[11px] tracking-[0.26em] uppercase text-white/50 pt-2">
                  Cancel at any hour
                </div>
              </div>
              <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-[14.5px] text-white/75">
                {[
                  'Unlimited real-time compositions',
                  'Four atmospheric rooms',
                  'Hour-of-day & weather input',
                  'Offline capture of any session',
                  'No ads. No autoplay. No feed.',
                  'Private listening, always',
                ].map(f => (
                  <li key={f} className="flex items-start gap-3">
                    <span
                      className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0"
                      style={{
                        background:
                          'linear-gradient(135deg, #ffcf7a, #ff6fa8 70%, #7c5cff)',
                      }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#begin"
                className="group mt-10 w-full rounded-full py-4 text-[14px] font-medium text-[#0b0420] inline-flex items-center justify-center gap-3 shadow-[0_30px_100px_-30px_rgba(255,138,108,0.9)]"
                style={{
                  background:
                    'linear-gradient(115deg, #ffe1a8 0%, #ffcf7a 28%, #ff8a6c 55%, #ff6fa8 88%)',
                }}
              >
                Begin the first hour
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section id="begin" className="relative z-10 py-32 md:py-48">
      <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
        <Reveal>
          <p className="text-[12px] tracking-[0.32em] uppercase text-white/55 mb-10">The hour is always now</p>
          <h2
            className="font-light tracking-[-0.02em] text-white"
            style={{ fontSize: 'clamp(44px, 7vw, 104px)', lineHeight: 0.98 }}
          >
            Begin where
            <br />
            <span
              style={{
                background:
                  'linear-gradient(110deg, #7de2e2 0%, #7c5cff 30%, #ff6fa8 60%, #ffcf7a 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              the light is.
            </span>
          </h2>
          <p className="mt-8 text-white/65 max-w-xl mx-auto leading-relaxed">
            Seven days of open hours, no card required. The first minute is waiting for you.
          </p>
          <div className="mt-12 flex items-center justify-center">
            <a
              href="#"
              className="group relative inline-flex items-center gap-4 rounded-full pl-8 pr-3 py-3 text-[15px] font-medium text-[#0b0420]"
              style={{
                background:
                  'linear-gradient(115deg, #ffe1a8 0%, #ffcf7a 28%, #ff8a6c 55%, #ff6fa8 88%)',
                boxShadow:
                  '0 40px 120px -30px rgba(255,138,108,0.9), 0 0 0 1px rgba(255,255,255,0.15) inset',
              }}
            >
              Open the first hour
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#0b0420]/90 text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative z-10 pb-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row gap-6 justify-between items-center text-[12px] tracking-[0.18em] uppercase text-white/45">
          <div className="flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, #ffcf7a, #ff8a6c 50%, #7c5cff 100%)',
              }}
            />
            Dawnline &middot; Composed in real time
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Notes</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <FixedAtmosphere />
      <CursorAurora />
      <Nav />
      <Hero />
      <ArcSection />
      <Rooms />
      <Quote />
      <Pricing />
      <FinalCta />
      <Footer />
    </main>
  )
}
