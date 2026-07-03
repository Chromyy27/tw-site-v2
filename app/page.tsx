'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Snowflake, Trophy, Clock, ChevronUp, ChevronDown, Minus, AlertCircle,
  Crown, Swords, Users, TrendingUp, Medal,
} from 'lucide-react'

interface LeaderboardEntry {
  tag: string
  name: string
  trophies: number
  clanName: string
  clanTag: string
  trophyGainsToday: number
  attacksUsed: number
}

interface ApiResponse {
  entries: LeaderboardEntry[]
  lastUpdated: number
  nextUpdate: number
  cached?: boolean
  error?: string
}

const CLAN_STYLES: Record<string, { bg: string; text: string; ring: string; dot: string; abbr: string }> = {
  '#232LU2U00QJ': { bg: 'bg-sky-500/15',     text: 'text-sky-300',     ring: 'ring-sky-500/30',     dot: 'bg-sky-400',     abbr: 'TW'  },
  '#232JPVV99RP': { bg: 'bg-purple-500/15',  text: 'text-purple-300',  ring: 'ring-purple-500/30',  dot: 'bg-purple-400',  abbr: 'TW2' },
  '#23P8PGVJJQ':  { bg: 'bg-emerald-500/15', text: 'text-emerald-300', ring: 'ring-emerald-500/30', dot: 'bg-emerald-400', abbr: 'TWX' },
}

/* ------------------------------------------------------------------ */
/*  Atmosphere                                                         */
/* ------------------------------------------------------------------ */

function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
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

interface Flake {
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
  sway: number
}

function Snowfall() {
  const [flakes, setFlakes] = useState<Flake[]>([])

  useEffect(() => {
    setFlakes(
      Array.from({ length: 42 }, () => ({
        left: Math.random() * 100,
        size: 1.5 + Math.random() * 3.5,
        duration: 9 + Math.random() * 16,
        delay: -Math.random() * 25,
        opacity: 0.25 + Math.random() * 0.55,
        sway: (Math.random() - 0.5) * 160,
      }))
    )
  }, [])

  return (
    <div className="fixed inset-0 -z-[5] pointer-events-none" aria-hidden>
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

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(0)
  const prevRef = useRef(0)

  useEffect(() => {
    const from = prevRef.current
    if (from === target) return
    prevRef.current = target
    const start = performance.now()
    let raf: number
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(from + (target - from) * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}

function ClanPill({ clanName, clanTag }: { clanName: string; clanTag: string }) {
  const s = CLAN_STYLES[clanTag]
  const label = s?.abbr ?? clanName.replace(/Team Winter\s*/i, 'TW').replace(/\s+/g, '').slice(0, 6)
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ring-1 flex-shrink-0
      ${s?.bg ?? 'bg-gray-700/30'} ${s?.text ?? 'text-gray-400'} ${s?.ring ?? 'ring-gray-600/30'}`}>
      {label}
    </span>
  )
}

function AttackDots({ used }: { used: number }) {
  return (
    <div className="flex gap-[3px] items-center">
      {Array.from({ length: 8 }, (_, i) => (
        <span
          key={i}
          className={`w-[7px] h-[7px] rounded-full transition-colors duration-300 ${
            i < used
              ? 'bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.6)]'
              : 'bg-white/[0.07]'
          }`}
        />
      ))}
    </div>
  )
}

function PositionDelta({ delta }: { delta: number }) {
  if (delta === 0) return <Minus className="w-3 h-3 text-gray-700" />
  if (delta > 0) {
    return (
      <span className="flex items-center gap-0.5 text-emerald-400 font-bold leading-none" style={{ fontSize: 11 }}>
        <ChevronUp className="w-3 h-3" />{delta}
      </span>
    )
  }
  return (
    <span className="flex items-center gap-0.5 text-red-400 font-bold leading-none" style={{ fontSize: 11 }}>
      <ChevronDown className="w-3 h-3" />{Math.abs(delta)}
    </span>
  )
}

function CountdownRing({ seconds }: { seconds: number }) {
  const r = 9
  const c = 2 * Math.PI * r
  const frac = Math.max(0, Math.min(1, seconds / 60))
  return (
    <div className="relative w-6 h-6 flex-shrink-0">
      <svg viewBox="0 0 24 24" className="w-6 h-6 -rotate-90">
        <circle cx="12" cy="12" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        <circle
          cx="12" cy="12" r={r} fill="none"
          stroke="#38bdf8" strokeWidth="2" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - frac)}
          className="transition-[stroke-dashoffset] duration-500 ease-linear"
        />
      </svg>
    </div>
  )
}

function getLegendDayLabel(): string {
  const d = new Date()
  if (d.getUTCHours() < 5) d.setUTCDate(d.getUTCDate() - 1)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
}

function getResetInfo(now: number): { remainingMs: number; elapsedFrac: number } {
  const next = new Date(now)
  next.setUTCHours(5, 0, 0, 0)
  if (next.getTime() <= now) next.setUTCDate(next.getUTCDate() + 1)
  const remainingMs = next.getTime() - now
  return { remainingMs, elapsedFrac: 1 - remainingMs / 86_400_000 }
}

function formatRemaining(ms: number): string {
  const totalMin = Math.floor(ms / 60_000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

/* ------------------------------------------------------------------ */
/*  Stat tiles                                                         */
/* ------------------------------------------------------------------ */

function StatTile({
  icon: Icon, label, value, sub, accent, delay,
}: {
  icon: typeof Trophy
  label: string
  value: number
  sub?: string
  accent: string
  delay: number
}) {
  const display = useCountUp(value)
  return (
    <div
      className="animate-fade-up relative overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.07] p-4 backdrop-blur-sm"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-25 ${accent}`} />
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="mt-2 font-display text-2xl sm:text-[28px] font-bold tabular-nums tracking-tight text-white">
        {display.toLocaleString()}
      </div>
      {sub && <div className="mt-0.5 text-[11px] text-gray-600">{sub}</div>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Podium                                                             */
/* ------------------------------------------------------------------ */

const PODIUM_META = [
  {
    ring: 'ring-amber-400/30',
    glow: 'shadow-[0_0_90px_-18px_rgba(251,191,36,0.4)]',
    halo: 'bg-amber-400/25',
    badge: 'bg-gradient-to-br from-amber-200 to-amber-500 text-amber-950',
    order: 'sm:order-2',
    raise: 'sm:-translate-y-3',
  },
  {
    ring: 'ring-slate-300/20',
    glow: 'shadow-[0_0_70px_-20px_rgba(203,213,225,0.28)]',
    halo: 'bg-slate-300/20',
    badge: 'bg-gradient-to-br from-slate-100 to-slate-400 text-slate-900',
    order: 'sm:order-1',
    raise: '',
  },
  {
    ring: 'ring-orange-500/25',
    glow: 'shadow-[0_0_70px_-20px_rgba(217,119,6,0.3)]',
    halo: 'bg-orange-500/20',
    badge: 'bg-gradient-to-br from-orange-300 to-orange-600 text-orange-950',
    order: 'sm:order-3',
    raise: '',
  },
]

function PodiumCard({
  entry, place, globalRank, delay,
}: {
  entry: LeaderboardEntry
  place: 0 | 1 | 2
  globalRank: number
  delay: number
}) {
  const meta = PODIUM_META[place]
  const trophies = useCountUp(entry.trophies, 1100)
  return (
    <div
      className={`animate-fade-up relative rounded-3xl bg-white/[0.035] ring-1 ${meta.ring} ${meta.glow} ${meta.order} ${meta.raise}
        backdrop-blur-sm p-5 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1 hover:sm:-translate-y-4`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {place === 0 && (
        <Crown className="animate-crown-float absolute -top-4 w-8 h-8 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
      )}
      <div className="relative mt-2">
        <div className={`absolute inset-0 rounded-full blur-xl ${meta.halo} animate-glow-pulse`} />
        <div className={`relative w-11 h-11 rounded-full ${meta.badge} font-display font-bold text-lg flex items-center justify-center`}>
          {globalRank}
        </div>
      </div>
      <div className="mt-3 font-display font-bold text-base text-white truncate max-w-full">{entry.name}</div>
      <div className="mt-1.5"><ClanPill clanName={entry.clanName} clanTag={entry.clanTag} /></div>
      <div className="mt-3 flex items-center gap-1.5">
        <Trophy className="w-4 h-4 text-amber-400" />
        <span className="font-display font-bold text-xl tabular-nums text-white">{trophies.toLocaleString()}</span>
      </div>
      <div className="mt-1 h-4 text-[12px] font-semibold tabular-nums">
        {entry.trophyGainsToday > 0
          ? <span className="text-emerald-400">+{entry.trophyGainsToday} today</span>
          : <span className="text-gray-700">— today</span>}
      </div>
      <div className="mt-2.5"><AttackDots used={entry.attacksUsed} /></div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                   */
/* ------------------------------------------------------------------ */

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-2xl ring-1 ring-white/[0.06] p-4 space-y-3">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-7 w-24 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="rounded-3xl ring-1 ring-white/[0.06] p-5 flex flex-col items-center gap-3">
            <div className="skeleton w-11 h-11 rounded-full" />
            <div className="skeleton h-4 w-28 rounded" />
            <div className="skeleton h-6 w-20 rounded" />
          </div>
        ))}
      </div>
      <div className="rounded-3xl ring-1 ring-white/[0.06] divide-y divide-white/[0.04]">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-[15px]">
            <div className="skeleton h-4 w-8 rounded" />
            <div className="skeleton h-4 flex-1 max-w-[180px] rounded" />
            <div className="skeleton h-4 w-16 rounded ml-auto" />
            <div className="skeleton h-4 w-10 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LeaderboardPage() {
  const [entries, setEntries]               = useState<LeaderboardEntry[]>([])
  const [lastUpdated, setLastUpdated]       = useState<number | null>(null)
  const [nextUpdate, setNextUpdate]         = useState<number | null>(null)
  const [error, setError]                   = useState<string | null>(null)
  const [loading, setLoading]               = useState(true)
  const [countdown, setCountdown]           = useState(60)
  const [positionDeltas, setPositionDeltas] = useState<Record<string, number>>({})
  const [highlighted, setHighlighted]       = useState<Set<string>>(new Set())
  const [clanFilter, setClanFilter]         = useState<string | null>(null)
  const [now, setNow]                       = useState<number | null>(null)

  const prevPositions   = useRef<Record<string, number>>({})
  const prevTrophies    = useRef<Record<string, number>>({})
  const highlightTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  async function fetchLeaderboard() {
    try {
      const res = await fetch('/api/leaderboard', { cache: 'no-store' })
      const data: ApiResponse = await res.json().catch(() => ({
        entries: [],
        lastUpdated: 0,
        nextUpdate: 0,
        error: `HTTP ${res.status} (server returned non-JSON)`,
      }))

      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
      if (!data.entries) throw new Error(data.error ?? 'No entries field in response')

      const newDeltas: Record<string, number> = {}
      const newHighlighted = new Set<string>()

      data.entries.forEach((entry, idx) => {
        const prevIdx = prevPositions.current[entry.tag]
        newDeltas[entry.tag] = prevIdx !== undefined ? prevIdx - idx : 0

        const prevT = prevTrophies.current[entry.tag]
        if (prevT !== undefined && prevT !== entry.trophies) {
          newHighlighted.add(entry.tag)
          clearTimeout(highlightTimers.current[entry.tag])
          highlightTimers.current[entry.tag] = setTimeout(() => {
            setHighlighted(prev => { const n = new Set(prev); n.delete(entry.tag); return n })
          }, 8_000)
        }
      })

      data.entries.forEach((entry, idx) => {
        prevPositions.current[entry.tag] = idx
        prevTrophies.current[entry.tag]  = entry.trophies
      })

      if (newHighlighted.size > 0) {
        setHighlighted(prev => new Set([...prev, ...newHighlighted]))
      }

      setPositionDeltas(newDeltas)
      setEntries(data.entries)
      setLastUpdated(data.lastUpdated)
      setNextUpdate(data.nextUpdate)
      setError(data.error ?? null)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 60_000)
    return () => {
      clearInterval(interval)
      Object.values(highlightTimers.current).forEach(clearTimeout)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setNow(Date.now())
    const tick = setInterval(() => {
      setNow(Date.now())
      if (nextUpdate) setCountdown(Math.max(0, Math.ceil((nextUpdate - Date.now()) / 1000)))
    }, 500)
    return () => clearInterval(tick)
  }, [nextUpdate])

  /* Derived data ---------------------------------------------------- */

  const globalRank = new Map(entries.map((e, i) => [e.tag, i + 1]))
  const filtered = clanFilter ? entries.filter(e => e.clanTag === clanFilter) : entries
  const podium = filtered.slice(0, 3)
  const clanCounts = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.clanTag] = (acc[e.clanTag] ?? 0) + 1
    return acc
  }, {})

  const totalTrophies = entries.reduce((s, e) => s + e.trophies, 0)
  const totalGains    = entries.reduce((s, e) => s + e.trophyGainsToday, 0)
  const totalAttacks  = entries.reduce((s, e) => s + e.attacksUsed, 0)

  const reset = now !== null ? getResetInfo(now) : null

  const COL = '3.5rem 1fr 7rem 4.5rem 7.5rem'

  return (
    <div className="relative min-h-screen text-white flex flex-col">
      <AuroraBackground />
      <Snowfall />

      {/* ---------------- Header ---------------- */}
      <header className="flex-none sticky top-0 z-20 border-b border-white/[0.06] bg-[#04070f]/70 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-sky-500/15 ring-1 ring-sky-400/30 flex items-center justify-center flex-shrink-0">
              <div className="absolute inset-0 rounded-xl bg-sky-400/20 blur-md animate-glow-pulse" />
              <Snowflake className="relative w-[18px] h-[18px] text-sky-300" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-[15px] font-bold tracking-tight">Team Winter</div>
              <div className="text-[11px] text-gray-500">Legend League · {getLegendDayLabel()}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 tracking-wider">LIVE</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <CountdownRing seconds={countdown} />
              <span className="tabular-nums w-8 hidden sm:inline">{countdown > 0 ? `${countdown}s` : 'now…'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------- Main ---------------- */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 pt-10 sm:pt-14 pb-16">

        {/* Hero */}
        <section className="animate-fade-up text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/[0.08] ring-1 ring-sky-400/20 text-sky-300 text-[11px] font-semibold uppercase tracking-[0.18em]">
            <Snowflake className="w-3.5 h-3.5" />
            Legend League · Live tracker
          </div>
          <h1 className="mt-5 font-display font-extrabold tracking-tight text-4xl sm:text-6xl leading-[1.05]">
            <span className="bg-gradient-to-b from-white via-sky-100 to-sky-300/80 bg-clip-text text-transparent
              drop-shadow-[0_0_35px_rgba(56,189,248,0.25)]">
              Team Winter
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            Every trophy, every attack — tracked in real time across all three clans.
          </p>

          {/* Legend day progress */}
          {reset && (
            <div className="mt-8 max-w-md mx-auto">
              <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Legend day</span>
                <span className="tabular-nums">resets in {formatRemaining(reset.remainingMs)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.05] ring-1 ring-white/[0.05] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-[width] duration-1000"
                  style={{ width: `${Math.max(1.5, reset.elapsedFrac * 100)}%` }}
                />
              </div>
            </div>
          )}
        </section>

        {loading && <LoadingSkeleton />}

        {error && (
          <div className="animate-fade-up mb-6 rounded-2xl bg-red-950/40 ring-1 ring-red-700/30 backdrop-blur-sm p-4 flex gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm text-red-300 font-medium">API Error</p>
              <p className="text-xs text-red-400/60 mt-0.5 break-all">{error}</p>
              {(error.includes('403') || error.includes('401') || error.includes('accessDenied') || error.includes('IP')) && (
                <p className="text-xs text-gray-500 mt-2">
                  The CoC API key is rejecting requests from Vercel&apos;s IP. You need to edit the key
                  at developer.clashofclans.com and set the allowed IP to <code className="text-gray-400">0.0.0.0/0</code>.
                </p>
              )}
              {error.includes('COC_API_KEY') && (
                <p className="text-xs text-gray-500 mt-2">
                  Go to Vercel → your project → Settings → Environment Variables and add <code className="text-gray-400">COC_API_KEY</code>.
                  Make sure to redeploy after adding it.
                </p>
              )}
            </div>
          </div>
        )}

        {!loading && entries.length > 0 && (
          <>
            {/* Stat tiles */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
              <StatTile icon={Users}      label="Legend players"  value={entries.length}  sub="across 3 clans"          accent="bg-sky-400"     delay={0} />
              <StatTile icon={Trophy}     label="Combined"        value={totalTrophies}   sub="total trophies"          accent="bg-amber-400"   delay={70} />
              <StatTile icon={TrendingUp} label="Gained today"    value={totalGains}      sub="since 05:00 UTC"         accent="bg-emerald-400" delay={140} />
              <StatTile icon={Swords}     label="Attacks used"    value={totalAttacks}    sub={`of ${entries.length * 8} possible`} accent="bg-purple-400" delay={210} />
            </section>

            {/* Clan filter */}
            <section className="flex flex-wrap items-center justify-center gap-2 mb-8">
              <button
                onClick={() => setClanFilter(null)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ring-1 transition-all duration-200 ${
                  clanFilter === null
                    ? 'bg-white/10 text-white ring-white/25'
                    : 'bg-white/[0.03] text-gray-500 ring-white/[0.07] hover:text-gray-300 hover:bg-white/[0.06]'
                }`}
              >
                All clans <span className="opacity-60 tabular-nums">{entries.length}</span>
              </button>
              {Object.entries(CLAN_STYLES).map(([tag, s]) => (
                <button
                  key={tag}
                  onClick={() => setClanFilter(clanFilter === tag ? null : tag)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold ring-1 transition-all duration-200 ${
                    clanFilter === tag
                      ? `${s.bg} ${s.text} ${s.ring}`
                      : 'bg-white/[0.03] text-gray-500 ring-white/[0.07] hover:text-gray-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {s.abbr} <span className="opacity-60 tabular-nums">{clanCounts[tag] ?? 0}</span>
                </button>
              ))}
            </section>

            {/* Podium */}
            {podium.length === 3 && (
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-10 sm:pt-4">
                {podium.map((entry, i) => (
                  <PodiumCard
                    key={entry.tag}
                    entry={entry}
                    place={i as 0 | 1 | 2}
                    globalRank={globalRank.get(entry.tag) ?? i + 1}
                    delay={120 + i * 90}
                  />
                ))}
              </section>
            )}

            {/* Table */}
            <section className="animate-fade-up rounded-3xl ring-1 ring-white/[0.07] bg-white/[0.02] backdrop-blur-sm overflow-hidden" style={{ animationDelay: '250ms' }}>
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Medal className="w-4 h-4 text-sky-400" />
                  <span className="font-display text-sm font-bold">Full standings</span>
                </div>
                {lastUpdated && now !== null && (
                  <span className="text-[11px] text-gray-600 tabular-nums">
                    updated {Math.max(0, Math.round((now - lastUpdated) / 1000))}s ago
                  </span>
                )}
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[580px]">
                  <div
                    className="grid items-center gap-3 px-5 py-2.5 border-b border-white/[0.05] bg-white/[0.02] text-[10px] text-gray-600 font-semibold uppercase tracking-widest"
                    style={{ gridTemplateColumns: COL }}
                  >
                    <span>Rank</span>
                    <span>Player</span>
                    <span className="text-right">Trophies</span>
                    <span className="text-right">Today</span>
                    <span>Attacks</span>
                  </div>
                  <div className="divide-y divide-white/[0.04]">
                    {filtered.map((entry) => {
                      const rank = globalRank.get(entry.tag) ?? 0
                      const isHighlighted = highlighted.has(entry.tag)
                      const delta = positionDeltas[entry.tag] ?? 0
                      const rankColor =
                        rank === 1 ? 'text-amber-400'
                        : rank === 2 ? 'text-slate-300'
                        : rank === 3 ? 'text-orange-400/90'
                        : 'text-gray-600'
                      return (
                        <div
                          key={entry.tag}
                          className={`grid items-center gap-3 px-5 py-3 transition-all duration-700 ${
                            isHighlighted
                              ? 'bg-emerald-500/[0.07] ring-1 ring-inset ring-emerald-500/20'
                              : 'hover:bg-white/[0.03]'
                          }`}
                          style={{ gridTemplateColumns: COL }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className={`font-display text-sm font-bold tabular-nums w-6 text-right ${rankColor}`}>{rank}</span>
                            <PositionDelta delta={delta} />
                          </div>
                          <div className="min-w-0 flex items-center gap-2">
                            <span className="font-semibold text-sm text-white truncate">{entry.name}</span>
                            <ClanPill clanName={entry.clanName} clanTag={entry.clanTag} />
                          </div>
                          <div className="text-right">
                            <div className="inline-flex items-center justify-end gap-1">
                              <Trophy className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                              <span className="font-bold text-sm tabular-nums">{entry.trophies.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            {entry.trophyGainsToday > 0 ? (
                              <span className={`font-semibold text-sm tabular-nums ${
                                isHighlighted ? 'text-emerald-300' : 'text-emerald-500'
                              }`}>+{entry.trophyGainsToday}</span>
                            ) : (
                              <span className="text-gray-700 text-sm">—</span>
                            )}
                          </div>
                          <div><AttackDots used={entry.attacksUsed} /></div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="animate-fade-up flex flex-col items-center justify-center py-24 gap-3 text-gray-700">
            <Trophy className="w-10 h-10 opacity-20" />
            <p className="text-sm">No Legend League members found across the 3 clans</p>
          </div>
        )}
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="flex-none py-6 border-t border-white/[0.05] bg-[#04070f]/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 text-[11px] text-gray-700">
          <span className="flex items-center gap-1.5">
            <Snowflake className="w-3 h-3 text-sky-800" />
            Team Winter · Legend League Tracker
          </span>
          <span>Resets daily at 05:00 UTC · Data refreshes every 60s</span>
        </div>
      </footer>
    </div>
  )
}
