'use client'

import { useEffect, useRef, useState } from 'react'
import { Snowflake, Trophy, Clock, ChevronUp, ChevronDown, Minus, AlertCircle } from 'lucide-react'

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

const CLAN_STYLES: Record<string, { bg: string; text: string; ring: string; abbr: string }> = {
  '#232LU2U00QJ': { bg: 'bg-sky-500/15',     text: 'text-sky-300',     ring: 'ring-sky-500/30',     abbr: 'TW'   },
  '#232JPVV99RP': { bg: 'bg-purple-500/15',  text: 'text-purple-300',  ring: 'ring-purple-500/30',  abbr: 'TW2'  },
  '#23P8PGVJJQ':  { bg: 'bg-emerald-500/15', text: 'text-emerald-300', ring: 'ring-emerald-500/30', abbr: 'TWX'  },
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
              ? 'bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.55)]'
              : 'bg-gray-800'
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

function getLegendDayLabel(): string {
  const d = new Date()
  if (d.getUTCHours() < 5) d.setUTCDate(d.getUTCDate() - 1)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
}

export default function LeaderboardPage() {
  const [entries, setEntries]               = useState<LeaderboardEntry[]>([])
  const [lastUpdated, setLastUpdated]       = useState<number | null>(null)
  const [nextUpdate, setNextUpdate]         = useState<number | null>(null)
  const [error, setError]                   = useState<string | null>(null)
  const [loading, setLoading]               = useState(true)
  const [countdown, setCountdown]           = useState(60)
  const [positionDeltas, setPositionDeltas] = useState<Record<string, number>>({})
  const [highlighted, setHighlighted]       = useState<Set<string>>(new Set())

  const prevPositions    = useRef<Record<string, number>>({})
  const prevTrophies     = useRef<Record<string, number>>({})
  const highlightTimers  = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  async function fetchLeaderboard() {
    try {
      const res = await fetch('/api/leaderboard', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: ApiResponse = await res.json()

      if (!data.entries) throw new Error(data.error ?? 'No entries in response')

      // Calculate position deltas BEFORE updating refs
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

      // Now update refs with new state
      data.entries.forEach((entry, idx) => {
        prevPositions.current[entry.tag]  = idx
        prevTrophies.current[entry.tag]   = entry.trophies
      })

      if (newHighlighted.size > 0) {
        setHighlighted(prev => new Set([...prev, ...newHighlighted]))
      }

      setPositionDeltas(newDeltas)
      setEntries(data.entries)
      setLastUpdated(data.lastUpdated)
      setNextUpdate(data.nextUpdate)
      setError(data.error ? data.error : null)
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

  // Countdown tick
  useEffect(() => {
    if (!nextUpdate) return
    const tick = setInterval(() => {
      setCountdown(Math.max(0, Math.ceil((nextUpdate - Date.now()) / 1000)))
    }, 500)
    return () => clearInterval(tick)
  }, [nextUpdate])

  const COL = '3.5rem 1fr 7rem 4.5rem 7.5rem'

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex-none border-b border-white/5 bg-[#0c1220]/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 ring-1 ring-sky-400/40 flex items-center justify-center flex-shrink-0">
              <Snowflake className="w-4 h-4 text-sky-400" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Team Winter</div>
              <div className="text-[11px] text-gray-500">Legend League · {getLegendDayLabel()}</div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 tracking-wider">LIVE</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-600">
              <Clock className="w-3 h-3" />
              <span className="tabular-nums w-8">{countdown > 0 ? `${countdown}s` : 'now…'}</span>
            </div>
          </div>
        </div>

        {!loading && entries.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 pb-2 flex items-center gap-5 text-[11px] text-gray-600">
            <span><span className="text-gray-400 font-medium">{entries.length}</span> Legend players</span>
            <span>3 clans combined</span>
            {lastUpdated && <span>Updated {Math.round((Date.now() - lastUpdated) / 1000)}s ago</span>}
          </div>
        )}
      </header>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-5">

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-9 h-9 rounded-full border-2 border-sky-500/20 border-t-sky-400 animate-spin" />
            <p className="text-sm text-gray-600">Fetching Legend League data…</p>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl bg-red-950/40 ring-1 ring-red-700/30 p-4 flex gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-300 font-medium">API Error</p>
              <p className="text-xs text-red-400/60 mt-0.5 break-all">{error}</p>
              {(error.includes('COC_API_KEY') || error.includes('401') || error.includes('403')) && (
                <p className="text-xs text-gray-600 mt-2">
                  Add COC_API_KEY to Vercel env vars. Your key must allow Vercel&apos;s outbound IPs —
                  open the CoC developer portal and set the allowed IP to 0.0.0.0/0.
                </p>
              )}
            </div>
          </div>
        )}

        {!loading && entries.length > 0 && (
          <div className="rounded-2xl ring-1 ring-white/5 bg-[#0c1220]/60 overflow-x-auto">
            <div className="min-w-[580px]">

              {/* Column headers */}
              <div
                className="grid items-center gap-3 px-4 py-2.5 border-b border-white/5 bg-white/[0.025] text-[10px] text-gray-600 font-semibold uppercase tracking-widest"
                style={{ gridTemplateColumns: COL }}
              >
                <span>Rank</span>
                <span>Player</span>
                <span className="text-right">Trophies</span>
                <span className="text-right">Today</span>
                <span>Attacks</span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/[0.04]">
                {entries.map((entry, idx) => {
                  const isHighlighted = highlighted.has(entry.tag)
                  const delta = positionDeltas[entry.tag] ?? 0
                  const rankColor =
                    idx === 0 ? 'text-amber-400'
                    : idx === 1 ? 'text-gray-300'
                    : idx === 2 ? 'text-amber-600/80'
                    : 'text-gray-600'

                  return (
                    <div
                      key={entry.tag}
                      className={`grid items-center gap-3 px-4 py-3 transition-all duration-700 ${
                        isHighlighted
                          ? 'bg-emerald-500/[0.06] ring-1 ring-inset ring-emerald-500/20'
                          : 'hover:bg-white/[0.02]'
                      }`}
                      style={{ gridTemplateColumns: COL }}
                    >
                      {/* Rank + Position delta */}
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-bold tabular-nums w-5 text-right ${rankColor}`}>
                          {idx + 1}
                        </span>
                        <PositionDelta delta={delta} />
                      </div>

                      {/* Player name + clan pill */}
                      <div className="min-w-0 flex items-center gap-2">
                        <span className="font-semibold text-sm text-white truncate">{entry.name}</span>
                        <ClanPill clanName={entry.clanName} clanTag={entry.clanTag} />
                      </div>

                      {/* Trophies */}
                      <div className="text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <Trophy className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span className="font-bold text-sm tabular-nums">
                            {entry.trophies.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Today gain */}
                      <div className="text-right">
                        {entry.trophyGainsToday > 0 ? (
                          <span className={`font-semibold text-sm tabular-nums ${
                            isHighlighted ? 'text-emerald-300' : 'text-emerald-500'
                          }`}>
                            +{entry.trophyGainsToday}
                          </span>
                        ) : (
                          <span className="text-gray-700 text-sm">—</span>
                        )}
                      </div>

                      {/* Attack dots */}
                      <div>
                        <AttackDots used={entry.attacksUsed} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-3 text-gray-700">
            <Trophy className="w-10 h-10 opacity-20" />
            <p className="text-sm">No Legend League members found across the 3 clans</p>
          </div>
        )}
      </main>

      <footer className="flex-none py-4 border-t border-white/[0.04] text-center text-[11px] text-gray-800">
        Team Winter Legend League Tracker · Resets daily at 05:00 UTC
      </footer>
    </div>
  )
}
