'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Snowflake, Trophy, Clock, ChevronUp, ChevronDown, Minus, AlertCircle,
  Crown, Swords, Users, TrendingUp, Medal,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { Snowfall } from '@/components/Atmosphere'
import { Tape } from '@/components/Paper'

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

const CLAN_STYLES: Record<string, { bg: string; dot: string; abbr: string }> = {
  '#232LU2U00QJ': { bg: 'bg-cartoon-sky/70',      dot: 'bg-[#1B87CE]', abbr: 'TW'  },
  '#232JPVV99RP': { bg: 'bg-cartoon-lavender/70', dot: 'bg-[#7C5CD6]', abbr: 'TW2' },
  '#23P8PGVJJQ':  { bg: 'bg-cartoon-mint/70',     dot: 'bg-[#1FA45B]', abbr: 'TWX' },
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
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-bold border-2 border-ink/70 text-ink flex-shrink-0
      ${s?.bg ?? 'bg-ink/10'}`}>
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
          className={`w-2 h-2 rounded-full transition-colors duration-300 border ${
            i < used
              ? 'bg-amber-400 border-ink/60'
              : 'bg-transparent border-ink/25'
          }`}
        />
      ))}
    </div>
  )
}

function PositionDelta({ delta }: { delta: number }) {
  if (delta === 0) return <Minus className="w-3 h-3 text-ink/25" strokeWidth={3} />
  if (delta > 0) {
    return (
      <span className="flex items-center gap-0.5 text-emerald-600 font-bold leading-none" style={{ fontSize: 12 }}>
        <ChevronUp className="w-3.5 h-3.5" strokeWidth={3} />{delta}
      </span>
    )
  }
  return (
    <span className="flex items-center gap-0.5 text-cartoon-red font-bold leading-none" style={{ fontSize: 12 }}>
      <ChevronDown className="w-3.5 h-3.5" strokeWidth={3} />{Math.abs(delta)}
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
        <circle cx="12" cy="12" r={r} fill="none" stroke="rgba(43,43,43,0.15)" strokeWidth="3" />
        <circle
          cx="12" cy="12" r={r} fill="none"
          stroke="#1B87CE" strokeWidth="3" strokeLinecap="round"
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
  icon: Icon, label, value, sub, bg, rot, delay,
}: {
  icon: typeof Trophy
  label: string
  value: number
  sub?: string
  bg: string
  rot: number
  delay: number
}) {
  const display = useCountUp(value)
  return (
    <div
      className={`animate-fade-up paper-card wobbly-sm p-4 ${bg}`}
      style={{ animationDelay: `${delay}ms`, transform: `rotate(${rot}deg)` }}
    >
      <div className="flex items-center gap-2 text-[12px] font-sans font-bold uppercase tracking-widest text-ink/60">
        <Icon className="w-4 h-4" strokeWidth={2.6} />
        {label}
      </div>
      <div className="mt-2 font-display text-2xl sm:text-[30px] tabular-nums text-ink">
        {display.toLocaleString()}
      </div>
      {sub && <div className="mt-0.5 text-[12px] font-bold text-ink/50">{sub}</div>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Podium                                                             */
/* ------------------------------------------------------------------ */

const PODIUM_META = [
  { bg: 'bg-cartoon-yellow', order: 'sm:order-2', raise: 'sm:-translate-y-3', rot: -0.7 },
  { bg: 'bg-[#ECECEC]',      order: 'sm:order-1', raise: '',                  rot: 0.8 },
  { bg: 'bg-[#F5BE93]',      order: 'sm:order-3', raise: '',                  rot: -0.5 },
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
      className={`animate-fade-up relative paper-card wobbly ${meta.bg} ${meta.order} ${meta.raise}
        p-5 pt-6 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1`}
      style={{ animationDelay: `${delay}ms`, transform: `rotate(${meta.rot}deg)` }}
    >
      <Tape className="-top-3.5 left-1/2 -ml-12" rotate={place === 1 ? 5 : -5} />
      {place === 0 && (
        <Crown className="animate-crown-float absolute -top-6 w-9 h-9 text-amber-500 fill-amber-300" strokeWidth={2.2} />
      )}
      <div className="w-12 h-12 rounded-full bg-white border-[3px] border-ink font-display text-xl text-ink
        flex items-center justify-center pt-1 shadow-[3px_3px_0_0_#2B2B2B]">
        {globalRank}
      </div>
      <div className="mt-3 font-display text-lg text-ink truncate max-w-full">{entry.name}</div>
      <div className="mt-1.5"><ClanPill clanName={entry.clanName} clanTag={entry.clanTag} /></div>
      <div className="mt-3 flex items-center gap-1.5">
        <Trophy className="w-5 h-5 text-amber-500" strokeWidth={2.4} />
        <span className="font-display text-2xl tabular-nums text-ink pt-0.5">{trophies.toLocaleString()}</span>
      </div>
      <div className="mt-1 h-5 text-[13px] font-bold tabular-nums">
        {entry.trophyGainsToday > 0
          ? <span className="text-emerald-700">+{entry.trophyGainsToday} today</span>
          : <span className="text-ink/35">— today</span>}
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="paper-card wobbly-sm bg-white p-4 space-y-3">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton h-7 w-24 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="paper-card wobbly bg-white p-5 flex flex-col items-center gap-3">
            <div className="skeleton w-12 h-12 rounded-full" />
            <div className="skeleton h-4 w-28 rounded" />
            <div className="skeleton h-6 w-20 rounded" />
          </div>
        ))}
      </div>
      <div className="paper-card wobbly bg-white divide-y-2 divide-dashed divide-ink/10">
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
    <div className="relative min-h-screen text-ink flex flex-col">
      <Snowfall count={26} />

      <Navbar />

      {/* ---------------- Main ---------------- */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 pt-6 sm:pt-10 pb-16">

        {/* Hero */}
        <section className="animate-fade-up text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border-2 border-ink
            shadow-[3px_3px_0_0_#2B2B2B] px-4 py-2 text-[13px] font-sans font-bold">
            <Snowflake className="w-4 h-4 text-[#1B87CE]" strokeWidth={2.6} />
            Live tracker · {getLegendDayLabel()}
          </div>
          <h1 className="mt-6 font-display text-4xl sm:text-6xl leading-[0.98] [text-shadow:4px_4px_0_rgba(43,43,43,0.12)]">
            Legend League
          </h1>
          <p className="mt-4 text-lg text-ink/65 font-sans font-bold max-w-xl mx-auto">
            Every trophy, every attack — tracked in real time across all three clans.
          </p>

          {/* Live status strip */}
          <div className="mt-6 flex items-center justify-center gap-5 text-[13px] font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cartoon-red border border-ink animate-pulse" />
              <span className="text-cartoon-red tracking-wider">LIVE</span>
            </div>
            <div className="flex items-center gap-2 text-ink/50">
              <CountdownRing seconds={countdown} />
              <span className="tabular-nums">{countdown > 0 ? `refresh in ${countdown}s` : 'refreshing…'}</span>
            </div>
          </div>

          {/* Legend day progress */}
          {reset && (
            <div className="mt-7 max-w-md mx-auto">
              <div className="flex items-center justify-between text-[12px] font-bold text-ink/50 mb-1.5">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" strokeWidth={2.6} /> Legend day</span>
                <span className="tabular-nums">resets in {formatRemaining(reset.remainingMs)}</span>
              </div>
              <div className="h-4 rounded-full bg-white border-2 border-ink overflow-hidden shadow-[2px_2px_0_0_#2B2B2B]">
                <div
                  className="h-full rounded-full border-r-2 border-ink transition-[width] duration-1000"
                  style={{
                    width: `${Math.max(3, reset.elapsedFrac * 100)}%`,
                    backgroundImage: 'repeating-linear-gradient(45deg, #7CC7EE 0 8px, #A9D9F5 8px 16px)',
                  }}
                />
              </div>
            </div>
          )}
        </section>

        {loading && <LoadingSkeleton />}

        {error && (
          <div className="animate-fade-up mb-6 paper-card wobbly-sm bg-[#FFDAD2] p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-cartoon-red flex-shrink-0 mt-0.5" strokeWidth={2.6} />
            <div className="min-w-0 font-sans">
              <p className="text-[15px] text-ink font-bold">API Error</p>
              <p className="text-[13px] text-ink/70 font-bold mt-0.5 break-all">{error}</p>
              {(error.includes('403') || error.includes('401') || error.includes('accessDenied') || error.includes('IP')) && (
                <p className="text-[13px] text-ink/60 font-bold mt-2">
                  The CoC API key is rejecting requests from Vercel&apos;s IP. You need to edit the key
                  at developer.clashofclans.com and set the allowed IP to <code>0.0.0.0/0</code>.
                </p>
              )}
              {error.includes('COC_API_KEY') && (
                <p className="text-[13px] text-ink/60 font-bold mt-2">
                  Go to Vercel → your project → Settings → Environment Variables and add <code>COC_API_KEY</code>.
                  Make sure to redeploy after adding it.
                </p>
              )}
            </div>
          </div>
        )}

        {!loading && entries.length > 0 && (
          <>
            {/* Stat tiles */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              <StatTile icon={Users}      label="Legend players" value={entries.length} sub="across 3 clans"  bg="bg-cartoon-sky"      rot={-0.7} delay={0} />
              <StatTile icon={Trophy}     label="Combined"       value={totalTrophies}  sub="total trophies"  bg="bg-cartoon-yellow"   rot={0.6}  delay={70} />
              <StatTile icon={TrendingUp} label="Gained today"   value={totalGains}     sub="since 05:00 UTC" bg="bg-cartoon-mint"     rot={-0.5} delay={140} />
              <StatTile icon={Swords}     label="Attacks used"   value={totalAttacks}   sub={`of ${entries.length * 8} possible`} bg="bg-cartoon-lavender" rot={0.7} delay={210} />
            </section>

            {/* Clan filter */}
            <section className="flex flex-wrap items-center justify-center gap-3 mb-10">
              <button
                onClick={() => setClanFilter(null)}
                className={`rounded-full border-2 border-ink px-4 py-1.5 text-[13px] font-sans font-bold transition-all duration-150 ${
                  clanFilter === null
                    ? 'bg-ink text-paper translate-x-[2px] translate-y-[2px]'
                    : 'bg-white text-ink shadow-[3px_3px_0_0_#2B2B2B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#2B2B2B]'
                }`}
              >
                All clans <span className="opacity-60 tabular-nums">{entries.length}</span>
              </button>
              {Object.entries(CLAN_STYLES).map(([tag, s]) => (
                <button
                  key={tag}
                  onClick={() => setClanFilter(clanFilter === tag ? null : tag)}
                  className={`flex items-center gap-1.5 rounded-full border-2 border-ink px-4 py-1.5 text-[13px] font-sans font-bold transition-all duration-150 ${
                    clanFilter === tag
                      ? `${s.bg} text-ink translate-x-[2px] translate-y-[2px]`
                      : 'bg-white text-ink/70 shadow-[3px_3px_0_0_#2B2B2B] hover:text-ink hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#2B2B2B]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full border border-ink/40 ${s.dot}`} />
                  {s.abbr} <span className="opacity-60 tabular-nums">{clanCounts[tag] ?? 0}</span>
                </button>
              ))}
            </section>

            {/* Podium */}
            {podium.length === 3 && (
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-5 mb-12 pt-4">
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
            <section className="animate-fade-up relative paper-card wobbly bg-white overflow-hidden" style={{ animationDelay: '250ms' }}>
              <div className="flex items-center justify-between px-5 py-3.5 border-b-[3px] border-ink bg-cartoon-yellow/60">
                <div className="flex items-center gap-2">
                  <Medal className="w-5 h-5 text-ink" strokeWidth={2.4} />
                  <span className="font-display text-base pt-0.5">Full standings</span>
                </div>
                {lastUpdated && now !== null && (
                  <span className="text-[12px] font-bold text-ink/50 tabular-nums">
                    updated {Math.max(0, Math.round((now - lastUpdated) / 1000))}s ago
                  </span>
                )}
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[580px]">
                  <div
                    className="grid items-center gap-3 px-5 py-2.5 border-b-2 border-ink/15 text-[11px] text-ink/50 font-sans font-bold uppercase tracking-widest"
                    style={{ gridTemplateColumns: COL }}
                  >
                    <span>Rank</span>
                    <span>Player</span>
                    <span className="text-right">Trophies</span>
                    <span className="text-right">Today</span>
                    <span>Attacks</span>
                  </div>
                  <div className="divide-y-2 divide-dashed divide-ink/10">
                    {filtered.map((entry) => {
                      const rank = globalRank.get(entry.tag) ?? 0
                      const isHighlighted = highlighted.has(entry.tag)
                      const delta = positionDeltas[entry.tag] ?? 0
                      const rankColor =
                        rank === 1 ? 'text-amber-500'
                        : rank === 2 ? 'text-ink/40'
                        : rank === 3 ? 'text-orange-400'
                        : 'text-ink/30'
                      return (
                        <div
                          key={entry.tag}
                          className={`grid items-center gap-3 px-5 py-3 transition-all duration-700 ${
                            isHighlighted ? 'bg-cartoon-yellow/40' : 'hover:bg-ink/[0.03]'
                          }`}
                          style={{ gridTemplateColumns: COL }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className={`font-display text-base tabular-nums w-6 text-right pt-0.5 ${rankColor}`}>{rank}</span>
                            <PositionDelta delta={delta} />
                          </div>
                          <div className="min-w-0 flex items-center gap-2">
                            <span className="font-sans font-bold text-[15px] text-ink truncate">{entry.name}</span>
                            <ClanPill clanName={entry.clanName} clanTag={entry.clanTag} />
                          </div>
                          <div className="text-right">
                            <div className="inline-flex items-center justify-end gap-1">
                              <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0" strokeWidth={2.4} />
                              <span className="font-bold text-[15px] tabular-nums">{entry.trophies.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            {entry.trophyGainsToday > 0 ? (
                              <span className="font-bold text-[15px] tabular-nums text-emerald-600">+{entry.trophyGainsToday}</span>
                            ) : (
                              <span className="text-ink/25 text-[15px] font-bold">—</span>
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
          <div className="animate-fade-up flex flex-col items-center justify-center py-24 gap-3 text-ink/40">
            <Trophy className="w-12 h-12 opacity-40" strokeWidth={2} />
            <p className="text-[15px] font-bold">No Legend League members found across the 3 clans</p>
          </div>
        )}
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="flex-none py-6 border-t-[3px] border-ink/10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 text-[12px] font-sans font-bold text-ink/45">
          <span className="flex items-center gap-1.5">
            <Snowflake className="w-3.5 h-3.5" strokeWidth={2.6} />
            Team Winter · Legend League Tracker
          </span>
          <span>Resets daily at 05:00 UTC · Data refreshes every 60s</span>
        </div>
      </footer>
    </div>
  )
}
