'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Snowflake,
  Trophy,
  Shield,
  Zap,
  Swords,
  Users,
  Activity,
  ArrowRight,
  Sparkles,
  Target,
  Crown,
  ChevronRight,
} from 'lucide-react'

function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

function FrostField() {
  const mounted = useMounted()
  if (!mounted) return null

  const flakes = Array.from({ length: 40 }, (_, i) => {
    const left = Math.random() * 100
    const delay = Math.random() * 20
    const dur = 14 + Math.random() * 22
    const size = 4 + Math.random() * 10
    const opacity = 0.15 + Math.random() * 0.4
    return { i, left, delay, dur, size, opacity }
  })

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {flakes.map(f => (
        <Snowflake
          key={f.i}
          className="absolute text-sky-300"
          style={{
            left: `${f.left}%`,
            top: '-30px',
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animation: `flake-fall ${f.dur}s linear ${f.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function GlowingOrb() {
  return (
    <div className="relative flex items-center justify-center" aria-hidden>
      <div className="absolute w-[520px] h-[520px] rounded-full bg-sky-500/10 blur-3xl animate-orb-pulse" />
      <div className="absolute w-[360px] h-[360px] rounded-full bg-cyan-400/20 blur-2xl animate-orb-pulse [animation-delay:1.2s]" />
      <div className="absolute w-[240px] h-[240px] rounded-full bg-gradient-to-br from-sky-300/40 via-cyan-400/30 to-blue-600/20 blur-xl" />

      <div className="relative w-[220px] h-[220px] rounded-full bg-gradient-to-br from-sky-200 via-cyan-300 to-blue-500 shadow-[0_0_80px_20px_rgba(56,189,248,0.45)] overflow-hidden">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/70 via-transparent to-transparent opacity-70 mix-blend-overlay" />
        <div className="absolute inset-0 rounded-full animate-orb-spin">
          <div className="absolute top-6 left-6 w-24 h-24 rounded-full bg-white/50 blur-2xl" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Snowflake className="w-20 h-20 text-white/90 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] animate-orb-spin-slow" />
        </div>
      </div>

      {[0, 1, 2].map(ring => (
        <div
          key={ring}
          className="absolute rounded-full border border-sky-300/20"
          style={{
            width: 280 + ring * 90,
            height: 280 + ring * 90,
            animation: `ring-pulse 4s ease-in-out ${ring * 0.6}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function Waveform() {
  return (
    <div className="flex items-center justify-center gap-1 h-10">
      {Array.from({ length: 28 }, (_, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-sky-500 to-cyan-300"
          style={{
            height: '100%',
            animation: `wave 1.2s ease-in-out ${i * 0.05}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items]
  return (
    <div className="relative overflow-hidden py-6 border-y border-white/5">
      <div className="flex gap-14 whitespace-nowrap animate-marquee">
        {doubled.map((t, i) => (
          <span key={i} className="flex items-center gap-3 text-sm text-gray-500 font-medium">
            <Snowflake className="w-3.5 h-3.5 text-sky-400/70" />
            {t}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050811] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050811] to-transparent" />
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  body,
  accent,
}: {
  icon: typeof Shield
  title: string
  body: string
  accent: string
}) {
  return (
    <div className="group relative rounded-2xl ring-1 ring-white/5 bg-[#0b1220]/60 p-6 overflow-hidden transition-all duration-500 hover:ring-sky-400/30 hover:-translate-y-1">
      <div
        className={`absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${accent}`}
        style={{ filter: 'blur(24px)' }}
      />
      <div className="relative">
        <div className="w-11 h-11 rounded-xl bg-sky-500/10 ring-1 ring-sky-400/30 flex items-center justify-center mb-5 group-hover:bg-sky-500/20 transition-colors">
          <Icon className="w-5 h-5 text-sky-300" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{body}</p>
      </div>
    </div>
  )
}

function StatCounter({ target, suffix = '', label }: { target: number; suffix?: string; label: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return
          const start = performance.now()
          const duration = 1600
          const step = (now: number) => {
            const p = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - p, 3)
            setValue(Math.round(target * eased))
            if (p < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
          io.disconnect()
        })
      },
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target])

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl md:text-6xl font-bold bg-gradient-to-b from-white to-sky-300 bg-clip-text text-transparent tabular-nums">
        {value.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-2 text-xs uppercase tracking-widest text-gray-500">{label}</div>
    </div>
  )
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setParallax({ x, y })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="relative min-h-screen bg-[#050811] text-white overflow-hidden">
      <style jsx global>{`
        @keyframes flake-fall {
          0% { transform: translate3d(0, -30px, 0) rotate(0deg); }
          100% { transform: translate3d(40px, 110vh, 0) rotate(360deg); }
        }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        .animate-orb-pulse { animation: orb-pulse 5s ease-in-out infinite; }
        @keyframes orb-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .animate-orb-spin { animation: orb-spin 18s linear infinite; }
        .animate-orb-spin-slow { animation: orb-spin 30s linear infinite; }
        @keyframes ring-pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes wave {
          0%, 100% { transform: scaleY(0.25); }
          50%      { transform: scaleY(1); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 40s linear infinite; }
        @keyframes grid-drift {
          from { background-position: 0 0; }
          to   { background-position: 48px 48px; }
        }
        .animate-grid-drift { animation: grid-drift 14s linear infinite; }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 1s cubic-bezier(.2,.7,.2,1) both; }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] animate-grid-drift z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(125,211,252,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.35) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-sky-500/20 blur-[120px] z-0" />
      <div className="pointer-events-none absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[120px] z-0" />

      <FrostField />

      <header className="relative z-30 sticky top-0 backdrop-blur-xl bg-[#050811]/70 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center ring-1 ring-sky-300/40 group-hover:ring-sky-200/60 transition">
              <Snowflake className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight">Team Winter</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#stats" className="hover:text-white transition">Clans</a>
            <a href="#join" className="hover:text-white transition">Join</a>
            <Link href="/leaderboard" className="hover:text-white transition">Leaderboard</Link>
          </nav>
          <Link
            href="/leaderboard"
            className="group inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium bg-sky-400/10 ring-1 ring-sky-400/30 text-sky-200 hover:bg-sky-400/20 hover:ring-sky-300/60 transition"
          >
            Live Board
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </header>

      <section ref={heroRef} className="relative z-10 max-w-6xl mx-auto px-6 pt-20 md:pt-28 pb-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="fade-up">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium bg-sky-400/10 ring-1 ring-sky-400/30 text-sky-200 mb-6">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-300" />
              </span>
              Legend League · Season Live
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.02]">
              <span className="bg-gradient-to-br from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
                The clan that freezes
              </span>{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-br from-sky-300 via-cyan-200 to-blue-400 bg-clip-text text-transparent">
                  the leaderboard.
                </span>
                <span className="absolute -inset-x-4 -inset-y-2 -z-10 bg-sky-400/10 blur-2xl" />
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-400 max-w-lg leading-relaxed">
              Team Winter is an elite competitive Clash of Clans family. Three clans, one mission —
              dominate Legend League every single day.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/leaderboard"
                className="group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold bg-gradient-to-br from-sky-300 to-blue-500 text-[#04101f] shadow-[0_10px_40px_-10px_rgba(56,189,248,0.6)] hover:shadow-[0_14px_50px_-10px_rgba(56,189,248,0.9)] transition"
              >
                <Trophy className="w-4 h-4" />
                View Live Leaderboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </Link>
              <a
                href="#join"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-sky-100 ring-1 ring-white/15 hover:ring-sky-300/60 hover:bg-white/5 transition"
              >
                Apply to Join
              </a>
            </div>

            <div className="mt-10 flex items-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                Max TH17 only
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-3.5 h-3.5 text-sky-400" />
                6000+ trophies
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                Daily attacks
              </div>
            </div>
          </div>

          <div
            className="relative h-[460px] md:h-[560px] flex items-center justify-center fade-up"
            style={{
              transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            <GlowingOrb />
          </div>
        </div>
      </section>

      <Marquee
        items={[
          'Legend League',
          'Three Clans',
          'Zero Compromise',
          '8/8 Attacks Daily',
          'Global Top 200',
          'Since 2019',
          'Champions',
          'Frostborn',
        ]}
      />

      <section id="stats" className="relative z-10 max-w-6xl mx-auto px-6 py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-sky-300 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            By the numbers
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Built for players who play <span className="text-sky-300">to win.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 rounded-3xl ring-1 ring-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-10 backdrop-blur-sm">
          <StatCounter target={150} suffix="+" label="Legend members" />
          <StatCounter target={3} label="Elite clans" />
          <StatCounter target={6200} suffix="+" label="Peak trophies" />
          <StatCounter target={98} suffix="%" label="Attack usage" />
        </div>
      </section>

      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-sky-300 mb-4">
            <Snowflake className="w-3.5 h-3.5" />
            What sets us apart
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Three clans. <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">One ecosystem.</span>
          </h2>
          <p className="mt-4 text-gray-400">
            Everything you need to push Legend League with a family that holds the standard.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <FeatureCard
            icon={Swords}
            title="Competitive War Roster"
            body="Coordinated war weekends with scouting reports, base calls, and strategy calls in voice every single day."
            accent="bg-gradient-to-br from-sky-500/40 to-blue-600/40"
          />
          <FeatureCard
            icon={Activity}
            title="Live Trophy Tracking"
            body="Real-time leaderboard refreshed every minute during the Legend League day. Know exactly where you stand."
            accent="bg-gradient-to-br from-cyan-400/40 to-sky-600/40"
          />
          <FeatureCard
            icon={Users}
            title="Three-clan Rotation"
            body="Graduate through TW, TW2, and TWX. Every roster spot is earned and every clan is a path to the top."
            accent="bg-gradient-to-br from-blue-500/40 to-indigo-500/40"
          />
          <FeatureCard
            icon={Target}
            title="Base & Attack Reviews"
            body="Weekly video reviews from our top attackers. Skip the plateau — learn from players who live at 6k."
            accent="bg-gradient-to-br from-sky-500/40 to-cyan-500/40"
          />
          <FeatureCard
            icon={Shield}
            title="Zero-tolerance Standards"
            body="Miss attacks, lose your spot. It isn't harsh — it's how we stay at the top of the global rankings."
            accent="bg-gradient-to-br from-blue-400/40 to-sky-500/40"
          />
          <FeatureCard
            icon={Zap}
            title="Always Online"
            body="Active global membership means coordinated pushes around the clock — from Asia to Europe to the Americas."
            accent="bg-gradient-to-br from-cyan-500/40 to-blue-500/40"
          />
        </div>
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-6 py-28">
        <div className="rounded-3xl ring-1 ring-sky-400/20 bg-gradient-to-br from-sky-500/10 via-[#0a1426] to-[#050811] p-10 md:p-16 overflow-hidden relative">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
                Hear the sound of a <span className="text-sky-300">Legend day.</span>
              </h3>
              <p className="mt-4 text-gray-400 max-w-md">
                Every minute, our tracker pulls live trophy data across the clan family.
                Every push, every defense, visualized instantly.
              </p>
              <Link
                href="/leaderboard"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-200 hover:text-white transition"
              >
                Open the live board
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="rounded-2xl bg-black/30 ring-1 ring-white/5 p-8 backdrop-blur">
              <Waveform />
              <div className="mt-6 flex items-center justify-between text-xs text-gray-500 font-mono">
                <span>LIVE · 05:00 UTC reset</span>
                <span className="text-sky-300">SYNC OK</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="join" className="relative z-10 max-w-4xl mx-auto px-6 py-28 text-center">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-br from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
            Think you can keep up?
          </span>
        </h2>
        <p className="mt-5 text-gray-400 text-lg max-w-xl mx-auto">
          We recruit on merit. If you can push Legend and you don&apos;t miss attacks,
          we want to hear from you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="https://discord.gg/"
            className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold bg-gradient-to-br from-sky-300 to-blue-500 text-[#04101f] shadow-[0_10px_40px_-10px_rgba(56,189,248,0.6)] hover:shadow-[0_14px_50px_-10px_rgba(56,189,248,0.9)] transition"
          >
            Apply on Discord
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </a>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-sky-100 ring-1 ring-white/15 hover:ring-sky-300/60 hover:bg-white/5 transition"
          >
            See who you&apos;re up against
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 mt-10">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
              <Snowflake className="w-3 h-3 text-white" />
            </div>
            <span>Team Winter · Legend League · since 2019</span>
          </div>
          <div className="flex gap-6">
            <Link href="/leaderboard" className="hover:text-white transition">Leaderboard</Link>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#join" className="hover:text-white transition">Join</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
