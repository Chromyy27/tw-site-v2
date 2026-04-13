import { NextResponse } from 'next/server'

const API_BASE = 'https://api.clashofclans.com/v1'
const CLAN_TAGS = ['#232LU2U00QJ', '#232JPVV99RP', '#23P8PGVJJQ']
const LEGEND_LEAGUE_ID = 29000022
const CACHE_TTL_MS = 60_000

interface PlayerSnapshot {
  tag: string
  name: string
  trophies: number
  clanName: string
  clanTag: string
  dayKey: string
  dayStartTrophies: number
  trophyGainsToday: number
  attacksUsed: number
  lastPollTrophies: number
}

export interface LeaderboardEntry {
  tag: string
  name: string
  trophies: number
  clanName: string
  clanTag: string
  trophyGainsToday: number
  attacksUsed: number
}

// Module-level cache — persists between serverless invocations on the same instance
const snapshots: Record<string, PlayerSnapshot> = {}
let lastFetchMs = 0
let cachedEntries: LeaderboardEntry[] = []

function getLegendDayKey(): string {
  const now = new Date()
  // Legend day resets at 05:00 UTC
  if (now.getUTCHours() < 5) {
    now.setUTCDate(now.getUTCDate() - 1)
  }
  return now.toISOString().slice(0, 10)
}

async function cocGet(path: string) {
  const key = process.env.COC_API_KEY
  if (!key) throw new Error('COC_API_KEY environment variable is not set')

  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: 'no-store',
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`CoC API ${res.status} for ${path}: ${body.slice(0, 200)}`)
  }

  return res.json()
}

async function withConcurrency<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  limit = 8
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let index = 0

  async function worker() {
    while (index < items.length) {
      const i = index++
      results[i] = await fn(items[i])
    }
  }

  const concurrency = Math.min(limit, items.length)
  if (concurrency === 0) return results
  await Promise.all(Array.from({ length: concurrency }, worker))
  return results
}

export async function GET() {
  const now = Date.now()

  // Return cached response if still fresh
  if (now - lastFetchMs < CACHE_TTL_MS && cachedEntries.length > 0) {
    return NextResponse.json({
      entries: cachedEntries,
      lastUpdated: lastFetchMs,
      nextUpdate: lastFetchMs + CACHE_TTL_MS,
      cached: true,
    })
  }

  try {
    const dayKey = getLegendDayKey()

    // 1. Fetch clan rosters in parallel
    const clans = await Promise.all(
      CLAN_TAGS.map(tag => cocGet(`/clans/${encodeURIComponent(tag)}`))
    )

    // 2. Collect Legend League members across all clans
    type RawMember = { tag: string; name: string; league?: { id: number } }
    const legendMembers: Array<{ tag: string; name: string; clanName: string; clanTag: string }> = []

    for (const clan of clans) {
      for (const m of (clan.memberList ?? []) as RawMember[]) {
        if (m.league?.id === LEGEND_LEAGUE_ID) {
          legendMembers.push({
            tag: m.tag,
            name: m.name,
            clanName: clan.name as string,
            clanTag: clan.tag as string,
          })
        }
      }
    }

    // 3. Fetch individual player trophy counts (clan roster can be slightly stale)
    type MemberWithTrophies = typeof legendMembers[0] & { trophies: number }
    const players = await withConcurrency<typeof legendMembers[0], MemberWithTrophies>(
      legendMembers,
      async (member) => {
        try {
          const p = await cocGet(`/players/${encodeURIComponent(member.tag)}`)
          return { ...member, trophies: p.trophies as number }
        } catch {
          return { ...member, trophies: snapshots[member.tag]?.trophies ?? 0 }
        }
      },
      8
    )

    // 4. Update snapshots and track trophy deltas
    for (const player of players) {
      const existing = snapshots[player.tag]
      const cur = player.trophies

      if (!existing || existing.dayKey !== dayKey) {
        // New day or new player — initialise fresh
        snapshots[player.tag] = {
          tag: player.tag,
          name: player.name,
          trophies: cur,
          clanName: player.clanName,
          clanTag: player.clanTag,
          dayKey,
          dayStartTrophies: cur,
          trophyGainsToday: 0,
          attacksUsed: 0,
          lastPollTrophies: cur,
        }
      } else {
        const delta = cur - existing.lastPollTrophies
        existing.name = player.name
        existing.clanName = player.clanName
        existing.trophies = cur
        existing.lastPollTrophies = cur

        if (delta > 0) {
          // Positive delta = attack win
          existing.trophyGainsToday += delta
          existing.attacksUsed = Math.min(existing.attacksUsed + 1, 8)
        }
        // Negative delta = defence loss — not counted as an attack
      }
    }

    // 5. Build sorted leaderboard
    const entries: LeaderboardEntry[] = Object.values(snapshots)
      .filter(s => s.dayKey === dayKey)
      .sort((a, b) => b.trophies - a.trophies)
      .map(({ tag, name, trophies, clanName, clanTag, trophyGainsToday, attacksUsed }) => ({
        tag, name, trophies, clanName, clanTag, trophyGainsToday, attacksUsed,
      }))

    cachedEntries = entries
    lastFetchMs = now

    return NextResponse.json({
      entries,
      lastUpdated: now,
      nextUpdate: now + CACHE_TTL_MS,
      cached: false,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    // If we have stale cached data, return it alongside the error
    if (cachedEntries.length > 0) {
      return NextResponse.json({
        entries: cachedEntries,
        lastUpdated: lastFetchMs,
        nextUpdate: lastFetchMs + CACHE_TTL_MS,
        cached: true,
        error: message,
      })
    }
    return NextResponse.json({ error: message, entries: [] }, { status: 500 })
  }
}
