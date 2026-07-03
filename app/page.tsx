'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Snowflake, Trophy, Swords, Crown, Shield, ArrowUpRight, ArrowRight,
  Hammer, Users, Star, Zap,
} from 'lucide-react'
import Navbar, { JOIN_URL } from '@/components/Navbar'
import { Snowfall } from '@/components/Atmosphere'

// Swap in your real numbers
const STATS: Array<[string, string]> = [
  ['150+', 'Warriors United'],
  ['95%',  'War Win Rate'],
  ['3',    'Active Clans'],
  ['8/8',  'Attacks. Every day.'],
]

const MARQUEE_ITEMS = [
  'TEAM WINTER', 'LEGEND LEAGUE', 'TW', 'WAR WINS', 'TW2', 'CWL CHAMPS', 'TWX', 'ELITE BASES',
]

interface PreviewEntry {
  tag: string
  name: string
  trophies: number
  trophyGainsToday: number
}

/* ------------------------------------------------------------------ */
/*  Hero stickers — floating pastel blobs, phantom-style               */
/* ------------------------------------------------------------------ */

function Sticker({
  icon: Icon, className, bg, rot, delay,
}: {
  icon: typeof Trophy
  className: string
  bg: string
  rot: number
  delay: number
}) {
  return (
    <div
      className={`animate-bob absolute rounded-3xl shadow-[0_16px_40px_-12px_rgba(15,27,51,0.35)]
        flex items-center justify-center ${bg} ${className}`}
      style={{ ['--rot' as string]: `${rot}deg`, animationDelay: `${delay}s`, transform: `rotate(${rot}deg)` }}
      aria-hidden
    >
      <Icon className="w-1/2 h-1/2 text-[#0F1B33]" strokeWidth={2.2} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Live tracker preview (bento card)                                  */
/* ------------------------------------------------------------------ */

function TrackerPreview() {
  const [entries, setEntries] = useState<PreviewEntry[] | null>(null)

  useEffect(() => {
    fetch('/api/leaderboard', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setEntries(Array.isArray(d.entries) ? d.entries.slice(0, 3) : []))
      .catch(() => setEntries([]))
  }, [])

  const medals = ['bg-amber-300', 'bg-slate-200', 'bg-orange-300']

  return (
    <div className="mt-6 space-y-2.5">
      {entries === null &&
        Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-[52px] rounded-2xl bg-white/50 animate-pulse" />
        ))}

      {entries !== null && entries.length > 0 &&
        entries.map((e, i) => (
          <div key={e.tag} className="flex items-center gap-3 rounded-2xl bg-white/70 backdrop-blur px-4 py-3">
            <span className={`w-7 h-7 rounded-full ${medals[i]} text-[#0F1B33] text-[13px] font-display font-extrabold flex items-center justify-center flex-shrink-0`}>
              {i + 1}
            </span>
            <span className="font-display font-bold text-[15px] text-[#0F1B33] truncate flex-1">{e.name}</span>
            {e.trophyGainsToday > 0 && (
              <span className="text-[12px] font-bold text-emerald-600 tabular-nums">+{e.trophyGainsToday}</span>
            )}
            <span className="flex items-center gap-1 font-bold text-[14px] text-[#0F1B33] tabular-nums">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              {e.trophies.toLocaleString()}
            </span>
          </div>
        ))}

      {entries !== null && entries.length === 0 && (
        <div className="rounded-2xl bg-white/60 px-4 py-5 text-sm text-[#0F1B33]/60">
          Live standings load right inside the tracker.
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Bento card                                                         */
/* ------------------------------------------------------------------ */

function BentoCard({
  id, icon: Icon, title, children, bg, className = '', footer,
}: {
  id?: string
  icon: typeof Trophy
  title: string
  children: React.ReactNode
  bg: string
  className?: string
  footer?: React.ReactNode
}) {
  return (
    <div
      id={id}
      className={`group rounded-[32px] p-7 sm:p-8 flex flex-col transition-transform duration-300 hover:-translate-y-1.5
        shadow-[0_20px_50px_-30px_rgba(15,27,51,0.35)] scroll-mt-28 ${bg} ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur flex items-center justify-center">
        <Icon className="w-6 h-6 text-[#0F1B33]" strokeWidth={2.2} />
      </div>
      <h3 className="mt-5 font-display font-extrabold text-2xl sm:text-[26px] tracking-tight text-[#0F1B33]">
        {title}
      </h3>
      <div className="mt-2.5 text-[15px] leading-relaxed text-[#0F1B33]/65 font-inter flex-1">
        {children}
      </div>
      {footer && <div className="mt-6">{footer}</div>}
    </div>
  )
}

function PillLink({
  href, children, external = false, dark = true,
}: {
  href: string
  children: React.ReactNode
  external?: boolean
  dark?: boolean
}) {
  const cls = `inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] font-inter font-bold
    transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98] ${
    dark ? 'bg-[#0F1B33] text-white' : 'bg-white text-[#0F1B33]'
  }`
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        <ArrowUpRight className="w-4 h-4" />
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {children}
      <ArrowRight className="w-4 h-4" />
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <div className="relative bg-[#F2F8FD] text-[#0F1B33]">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#AFDEF9] via-[#BFE5FA] to-[#E3F2FC] rounded-b-[40px] sm:rounded-b-[56px] pb-20">
        {/* soft glow blobs */}
        <div className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-white/40 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-[520px] h-[520px] rounded-full bg-[#CBB8FF]/40 blur-3xl pointer-events-none" />

        <Navbar theme="light" />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-10 pt-14 sm:pt-20 lg:pt-24 pb-8 text-center">

          {/* Floating stickers */}
          <Sticker icon={Trophy}    bg="bg-[#FFE175]" rot={-8} delay={0}   className="hidden md:flex w-20 h-20 left-[4%] top-[18%]" />
          <Sticker icon={Swords}    bg="bg-[#CBB8FF]" rot={10} delay={0.7} className="hidden md:flex w-16 h-16 left-[12%] bottom-[6%]" />
          <Sticker icon={Crown}     bg="bg-[#FFC9A8]" rot={7}  delay={1.4} className="hidden md:flex w-[72px] h-[72px] right-[5%] top-[14%]" />
          <Sticker icon={Shield}    bg="bg-[#A8F0C6]" rot={-6} delay={2.1} className="hidden md:flex w-16 h-16 right-[13%] bottom-[10%]" />
          <Sticker icon={Snowflake} bg="bg-white"     rot={12} delay={2.8} className="hidden lg:flex w-14 h-14 right-[24%] top-[2%]" />

          {/* Eyebrow */}
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-4 py-2 text-[12px] font-inter font-bold tracking-wide">
            <Snowflake className="w-3.5 h-3.5 text-sky-500" />
            150+ members · 3 clans · one family
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up-delay-1 mt-7 mx-auto max-w-4xl font-display font-extrabold tracking-[-0.03em] leading-[1.02]
            text-[clamp(2.6rem,7vw,5.5rem)]">
            The clan family that&rsquo;ll take you to{' '}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10">Legend.</span>
              <span className="absolute inset-x-0 bottom-[0.08em] h-[0.32em] bg-[#FFE175] -rotate-1 rounded-md" aria-hidden />
            </span>
          </h1>

          {/* Sub */}
          <p className="animate-fade-up-delay-2 mt-6 mx-auto max-w-xl text-base sm:text-lg text-[#0F1B33]/65 font-inter leading-relaxed">
            Three war-hungry clans, elite base architects, and a live Legend League
            leaderboard we refuse to fall off. Bring your best attacks.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-delay-3 mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href={JOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#0F1B33] text-white px-7 py-4 text-sm font-inter font-bold
                transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98] shadow-[0_16px_40px_-12px_rgba(15,27,51,0.5)]"
            >
              Join the Clan
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <Link
              href="/leaderboard"
              className="flex items-center gap-2 rounded-full bg-white/90 backdrop-blur text-[#0F1B33] px-7 py-4 text-sm font-inter font-bold
                transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Live tracker
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Rating strip */}
          <div className="animate-fade-up-delay-4 mt-9 flex items-center justify-center gap-2 text-[13px] font-inter font-semibold text-[#0F1B33]/60">
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </span>
            Rated 5.0 by our war log
          </div>
        </div>
      </section>

      {/* ================= MARQUEE ================= */}
      <div className="relative overflow-hidden bg-[#0F1B33] py-5 -mt-10 pt-14 sm:pt-16 -z-0">
        <div className="marquee-track flex w-max items-center gap-8 pr-8">
          {[0, 1].map(copy => (
            <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
              {MARQUEE_ITEMS.map(item => (
                <span key={`${copy}-${item}`} className="flex items-center gap-8">
                  <span className="font-podium uppercase tracking-wider text-white/90 text-lg whitespace-nowrap">{item}</span>
                  <Snowflake className="w-4 h-4 text-sky-400/80 flex-shrink-0" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ================= BENTO ================= */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 pt-20 sm:pt-28">
        <h2 className="font-display font-extrabold tracking-[-0.02em] text-4xl sm:text-5xl max-w-2xl">
          Everything your village needs.
        </h2>
        <p className="mt-4 max-w-xl text-[#0F1B33]/60 font-inter text-base sm:text-lg">
          From daily Legend pushes to CWL rosters — Team Winter runs the whole show.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-6 gap-4 sm:gap-5">
          <BentoCard
            icon={Zap}
            title="Legend League, live."
            bg="bg-[#DCD2FF]"
            className="md:col-span-4"
            footer={<PillLink href="/leaderboard">Open the tracker</PillLink>}
          >
            Every trophy and every attack across all three clans, refreshed every 60
            seconds. Podium glory included.
            <TrackerPreview />
          </BentoCard>

          <BentoCard
            id="clans"
            icon={Users}
            title="Three clans, one family."
            bg="bg-[#BEEFD4]"
            className="md:col-span-2"
          >
            TW, TW2 and TWX — from competitive war cores to a home for rising
            attackers. There&rsquo;s a spot at your level.
            <div className="mt-5 flex flex-wrap gap-2">
              {['TW', 'TW2', 'TWX'].map(c => (
                <span key={c} className="rounded-full bg-white/70 px-4 py-1.5 text-[13px] font-bold font-inter">
                  {c}
                </span>
              ))}
            </div>
          </BentoCard>

          <BentoCard
            id="architects"
            icon={Hammer}
            title="War Architects."
            bg="bg-[#FFEDB3]"
            className="md:col-span-2"
          >
            Elite base builders craft our war layouts. Bases that don&rsquo;t just
            survive attacks — they steal stars back.
          </BentoCard>

          <BentoCard
            id="cwl"
            icon={Trophy}
            title="CWL, every season."
            bg="bg-[#FFD5BE]"
            className="md:col-span-2"
          >
            Organized rosters, planned hits and no missed attacks. We treat Clan War
            Leagues like the playoffs.
          </BentoCard>

          <BentoCard
            id="recruitment"
            icon={Swords}
            title="Recruitment is open."
            bg="bg-[#BFE4FB]"
            className="md:col-span-2"
            footer={<PillLink href={JOIN_URL} external>Apply in-game</PillLink>}
          >
            Active daily, hungry in wars, drama-free. Sound like you? The winter
            gates are open.
          </BentoCard>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
          {STATS.map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="font-display font-extrabold tracking-[-0.03em] text-5xl sm:text-6xl lg:text-7xl">
                {value}
              </div>
              <div className="mt-2 text-[12px] sm:text-sm font-inter font-bold uppercase tracking-widest text-[#0F1B33]/45">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-10 pb-24">
        <div className="relative overflow-hidden rounded-[40px] sm:rounded-[56px] bg-[#0F1B33] px-6 sm:px-16 py-16 sm:py-24 text-center">
          {/* frost glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
          <Snowfall zIndex="z-0" count={24} />

          <div className="relative z-10">
            <div className="mx-auto w-16 h-16 rounded-3xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center">
              <Snowflake className="w-8 h-8 text-sky-300" />
            </div>
            <h2 className="mt-7 font-display font-extrabold tracking-[-0.03em] text-white text-4xl sm:text-6xl leading-[1.05]">
              Ready to push Legend?
            </h2>
            <p className="mt-5 mx-auto max-w-md text-white/60 font-inter text-base sm:text-lg">
              Winter is always coming. Join the family and make your attacks count.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
              <a
                href={JOIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-white text-[#0F1B33] px-7 py-4 text-sm font-inter font-bold
                  transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98]"
              >
                Join the Clan
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <Link
                href="/leaderboard"
                className="flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/20 text-white px-7 py-4 text-sm font-inter font-bold
                  transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98]"
              >
                Watch the leaderboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0A1326] text-white rounded-t-[40px] sm:rounded-t-[56px] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-14 pb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 text-[13px] font-inter font-semibold text-white/60">
              <Link href="/leaderboard" className="hover:text-white transition-colors">Legend League</Link>
              <a href={JOIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Join in-game</a>
            </div>
            <p className="text-[11px] font-inter text-white/35 text-center sm:text-right max-w-sm">
              Fan-made community site. Not affiliated with, endorsed or sponsored by Supercell.
            </p>
          </div>
        </div>
        {/* Giant wordmark */}
        <div className="select-none pointer-events-none pb-3" aria-hidden>
          <div className="font-podium font-bold uppercase leading-[0.82] tracking-[-0.03em] text-center
            text-[11.5vw] text-white/[0.92] whitespace-nowrap">
            TEAM WINTER
          </div>
        </div>
      </footer>
    </div>
  )
}
