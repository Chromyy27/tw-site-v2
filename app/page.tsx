'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Snowflake, Trophy, Swords, Crown, Shield, ArrowUpRight, ArrowRight,
  Hammer, Users, Star, Zap,
} from 'lucide-react'
import Navbar, { JOIN_URL } from '@/components/Navbar'
import { Snowfall } from '@/components/Atmosphere'
import { Tape, TornEdge } from '@/components/Paper'
import {
  ScribbleUnderline, DoodleArrow, DoodleArrowLeft, DoodleCircle,
  Sparkle, SpeechBubble, Barbarian,
} from '@/components/Doodles'

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
/*  Hero stickers — die-cut paper cutouts                              */
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
      className={`animate-bob absolute rounded-2xl border-[3px] border-ink ring-4 ring-white
        shadow-[5px_5px_0_0_#2B2B2B] flex items-center justify-center ${bg} ${className}`}
      style={{ ['--rot' as string]: `${rot}deg`, animationDelay: `${delay}s`, transform: `rotate(${rot}deg)` }}
      aria-hidden
    >
      <Icon className="w-1/2 h-1/2 text-ink" strokeWidth={2.4} />
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

  const medals = ['bg-cartoon-yellow', 'bg-[#E9E9E9]', 'bg-[#F5BE93]']

  return (
    <div className="mt-6 space-y-3">
      {entries === null &&
        Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-[52px] rounded-2xl skeleton border-2 border-ink/10" />
        ))}

      {entries !== null && entries.length > 0 &&
        entries.map((e, i) => (
          <div
            key={e.tag}
            className="flex items-center gap-3 bg-white border-2 border-ink rounded-2xl px-4 py-3 shadow-[3px_3px_0_0_#2B2B2B]"
            style={{ transform: `rotate(${i % 2 === 0 ? -0.4 : 0.5}deg)` }}
          >
            <span className={`w-8 h-8 rounded-full ${medals[i]} border-2 border-ink text-ink font-display text-sm
              flex items-center justify-center flex-shrink-0 pt-0.5`}>
              {i + 1}
            </span>
            <span className="font-sans font-bold text-[16px] text-ink truncate flex-1">{e.name}</span>
            {e.trophyGainsToday > 0 && (
              <span className="text-[13px] font-bold text-emerald-600 tabular-nums">+{e.trophyGainsToday}</span>
            )}
            <span className="flex items-center gap-1 font-bold text-[15px] text-ink tabular-nums">
              <Trophy className="w-4 h-4 text-amber-500" strokeWidth={2.4} />
              {e.trophies.toLocaleString()}
            </span>
          </div>
        ))}

      {entries !== null && entries.length === 0 && (
        <div className="bg-white/70 border-2 border-dashed border-ink/30 rounded-2xl px-4 py-5 text-[15px] text-ink/60 font-bold">
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
  id, icon: Icon, title, children, bg, rot = 0, className = '', footer, tape = true,
}: {
  id?: string
  icon: typeof Trophy
  title: string
  children: React.ReactNode
  bg: string
  rot?: number
  className?: string
  footer?: React.ReactNode
  tape?: boolean
}) {
  return (
    <div
      id={id}
      style={{ transform: `rotate(${rot}deg)` }}
      className={`group relative paper-card wobbly p-7 sm:p-8 flex flex-col transition-transform duration-300
        hover:-translate-y-1.5 scroll-mt-28 ${bg} ${className}`}
    >
      {tape && <Tape className="-top-3.5 left-1/2 -ml-12" rotate={-4} />}
      <div className="w-12 h-12 rounded-full bg-white border-[3px] border-ink flex items-center justify-center">
        <Icon className="w-6 h-6 text-ink" strokeWidth={2.4} />
      </div>
      <h3 className="mt-5 font-display text-2xl sm:text-[27px] text-ink">
        {title}
      </h3>
      <div className="mt-2.5 text-[16px] leading-relaxed text-ink/70 font-sans font-bold flex-1">
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
  const cls = `btn-paper px-5 py-2.5 text-sm ${dark ? 'bg-ink text-paper' : 'bg-white text-ink'}`
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        <ArrowUpRight className="w-4 h-4" strokeWidth={2.6} />
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {children}
      <ArrowRight className="w-4 h-4" strokeWidth={2.6} />
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <div className="relative text-ink">

      {/* ================= HERO ================= */}
      <section className="relative bg-cartoon-sky pb-24 sm:pb-28">
        {/* flat paper clouds */}
        <div className="absolute top-24 -left-16 w-72 h-24 rounded-full bg-white/60 pointer-events-none" aria-hidden />
        <div className="absolute top-48 right-[-40px] w-80 h-28 rounded-full bg-white/50 pointer-events-none" aria-hidden />
        <div className="absolute bottom-32 left-[12%] w-56 h-20 rounded-full bg-white/40 pointer-events-none" aria-hidden />

        <Navbar />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-10 pt-14 sm:pt-20 lg:pt-24 pb-6 text-center">

          {/* Floating stickers */}
          <Sticker icon={Trophy}    bg="bg-cartoon-yellow"   rot={-8} delay={0}   className="hidden md:flex w-20 h-20 left-[4%] top-[18%]" />
          <Sticker icon={Swords}    bg="bg-cartoon-lavender" rot={10} delay={0.7} className="hidden md:flex w-16 h-16 left-[12%] bottom-[4%]" />
          <Sticker icon={Crown}     bg="bg-cartoon-peach"    rot={7}  delay={1.4} className="hidden md:flex w-[72px] h-[72px] right-[5%] top-[14%]" />
          <Sticker icon={Shield}    bg="bg-cartoon-mint"     rot={-6} delay={2.1} className="hidden md:flex w-16 h-16 right-[13%] bottom-[8%]" />
          <Sticker icon={Snowflake} bg="bg-white"            rot={12} delay={2.8} className="hidden lg:flex w-14 h-14 right-[24%] top-[0%]" />

          {/* Paper-doll barbarian mascot */}
          <div
            className="animate-bob hidden lg:flex absolute left-[1.5%] top-[46%] flex-col items-start gap-2 z-10"
            style={{ ['--rot' as string]: '-4deg', animationDelay: '1s', transform: 'rotate(-4deg)' }}
            aria-hidden
          >
            <SpeechBubble className="ml-6 -rotate-2">MORE WARS!</SpeechBubble>
            <div className="mt-1 w-24 h-24 rounded-2xl bg-cartoon-sky border-[3px] border-ink ring-4 ring-white
              shadow-[5px_5px_0_0_#2B2B2B] flex items-center justify-center overflow-hidden">
              <Barbarian className="w-20 h-20 mt-2" />
            </div>
          </div>

          {/* doodle sparkles */}
          <Sparkle className="hidden md:block absolute w-6 h-6 left-[27%] top-[6%] text-cartoon-yellow rotate-12" />
          <Sparkle className="hidden md:block absolute w-4 h-4 left-[21%] top-[13%] text-white -rotate-6" />
          <Sparkle className="hidden md:block absolute w-5 h-5 right-[19%] bottom-[24%] text-cartoon-yellow rotate-6" />

          {/* Eyebrow */}
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white border-2 border-ink
            shadow-[3px_3px_0_0_#2B2B2B] px-4 py-2 text-[13px] font-sans font-bold">
            <Snowflake className="w-4 h-4 text-[#1B87CE]" strokeWidth={2.6} />
            150+ members · 3 clans · one family
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up-delay-1 mt-8 mx-auto max-w-4xl font-display leading-[1.02]
            text-[clamp(2.6rem,6.5vw,5rem)] [text-shadow:4px_4px_0_rgba(43,43,43,0.12)]">
            The clan family that&rsquo;ll take you to{' '}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10">Legend.</span>
              <span className="absolute inset-x-[-4px] bottom-[0.02em] h-[0.42em] bg-cartoon-yellow wobbly-sm -rotate-1" aria-hidden />
            </span>
          </h1>

          {/* Sub */}
          <p className="animate-fade-up-delay-2 mt-6 mx-auto max-w-xl text-lg sm:text-xl text-ink/70 font-sans font-bold leading-relaxed">
            Three war-hungry clans, elite base architects, and a live Legend League
            leaderboard we refuse to fall off. Bring your best attacks.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-delay-3 mt-9 flex flex-wrap items-center justify-center gap-4">
            <span className="relative inline-flex">
              <a
                href={JOIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-paper bg-cartoon-yellow text-ink px-7 py-3.5 text-base"
              >
                Join the Clan
                <ArrowUpRight className="w-5 h-5" strokeWidth={2.6} />
              </a>
              {/* handwritten nudge */}
              <span className="hidden xl:flex absolute right-full top-1/2 -translate-y-[80%] mr-3 items-center gap-1.5 w-max rotate-[-5deg]" aria-hidden>
                <span className="font-hand text-xl text-ink/80 whitespace-nowrap">smash this!</span>
                <DoodleArrow className="w-9 h-8 text-ink/80 rotate-[15deg]" />
              </span>
            </span>
            <Link href="/leaderboard" className="btn-paper bg-white text-ink px-7 py-3.5 text-base">
              <span className="w-2.5 h-2.5 rounded-full bg-cartoon-red border border-ink animate-pulse" />
              Live tracker
              <ArrowRight className="w-5 h-5" strokeWidth={2.6} />
            </Link>
          </div>

          {/* Rating strip */}
          <div className="animate-fade-up-delay-4 mt-9 flex items-center justify-center gap-2 text-[14px] font-sans font-bold text-ink/60">
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-ink" strokeWidth={2} />
              ))}
            </span>
            Rated 5.0 by our war log
          </div>
        </div>

        <TornEdge fill="#FBF3E4" />
      </section>

      {/* ================= MARQUEE ================= */}
      <div className="relative overflow-hidden bg-cartoon-yellow border-y-[3px] border-ink py-3.5 -rotate-1 scale-[1.02] my-6">
        <div className="marquee-track flex w-max items-center gap-8 pr-8">
          {[0, 1].map(copy => (
            <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
              {MARQUEE_ITEMS.map(item => (
                <span key={`${copy}-${item}`} className="flex items-center gap-8">
                  <span className="font-display tracking-wide text-ink text-lg whitespace-nowrap pt-1">{item}</span>
                  <Snowflake className="w-4 h-4 text-ink flex-shrink-0" strokeWidth={2.6} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ================= BENTO ================= */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 pt-16 sm:pt-24">
        <h2 className="font-display text-4xl sm:text-5xl max-w-2xl [text-shadow:3px_3px_0_rgba(43,43,43,0.1)]">
          Everything your village needs.
        </h2>
        <ScribbleUnderline className="mt-3 w-56 sm:w-64 text-cartoon-red" />
        <p className="mt-4 max-w-xl text-ink/60 font-sans font-bold text-lg">
          From daily Legend pushes to CWL rosters — Team Winter runs the whole show.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-6 gap-6 sm:gap-7">
          <BentoCard
            icon={Zap}
            title="Legend League, live."
            bg="bg-cartoon-lavender"
            rot={-0.5}
            className="md:col-span-4"
            footer={<PillLink href="/leaderboard">Open the tracker</PillLink>}
          >
            Every trophy and every attack across all three clans, refreshed every 60
            seconds. Podium glory included.
            {/* handwritten note */}
            <span className="hidden md:flex absolute right-8 top-24 flex-col items-center rotate-[6deg]" aria-hidden>
              <span className="font-hand text-xl text-ink/80 whitespace-nowrap">live, actually!</span>
              <DoodleArrow className="w-9 h-8 text-ink/80 -scale-x-100 rotate-[10deg]" />
            </span>
            <TrackerPreview />
          </BentoCard>

          <BentoCard
            id="clans"
            icon={Users}
            title="Three clans, one family."
            bg="bg-cartoon-mint"
            rot={0.7}
            className="md:col-span-2"
          >
            TW, TW2 and TWX — from competitive war cores to a home for rising
            attackers. There&rsquo;s a spot at your level.
            <div className="mt-5 flex flex-wrap gap-2">
              {['TW', 'TW2', 'TWX'].map(c => (
                <span key={c} className="rounded-full bg-white border-2 border-ink px-4 py-1 text-[14px] font-bold font-sans shadow-[2px_2px_0_0_#2B2B2B]">
                  {c}
                </span>
              ))}
            </div>
          </BentoCard>

          <BentoCard
            id="architects"
            icon={Hammer}
            title="War Architects."
            bg="bg-cartoon-yellow"
            rot={0.6}
            className="md:col-span-2"
          >
            Elite base builders craft our war layouts. Bases that don&rsquo;t just
            survive attacks — they steal stars back.
          </BentoCard>

          <BentoCard
            id="cwl"
            icon={Trophy}
            title="CWL, every season."
            bg="bg-cartoon-peach"
            rot={-0.6}
            className="md:col-span-2"
          >
            Organized rosters, planned hits and no missed attacks. We treat Clan War
            Leagues like the playoffs.
          </BentoCard>

          <BentoCard
            id="recruitment"
            icon={Swords}
            title="Recruitment is open."
            bg="bg-cartoon-sky"
            rot={0.5}
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
          {STATS.map(([value, label], i) => (
            <div key={label} className="text-center" style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}>
              <div className="relative inline-block px-3">
                {i === 1 && <DoodleCircle className="text-cartoon-red -m-2" />}
                <div className="relative font-display text-5xl sm:text-6xl lg:text-7xl [text-shadow:4px_4px_0_rgba(43,43,43,0.12)]">
                  {value}
                </div>
              </div>
              <div className="mt-2 text-[13px] sm:text-sm font-sans font-bold uppercase tracking-widest text-ink/50">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-10 pb-28">
        <div className="relative paper-card wobbly bg-cartoon-night text-paper px-6 sm:px-16 py-16 sm:py-20 text-center overflow-hidden -rotate-[0.5deg]">
          <Tape className="-top-3.5 left-8 sm:left-16" rotate={-8} />
          <Tape className="-top-3.5 right-8 sm:right-16" rotate={7} />
          <Snowfall zIndex="z-0" count={22} />

          <div className="relative z-10">
            <div className="mx-auto w-16 h-16 rounded-full bg-white border-[3px] border-ink flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,0.35)]">
              <Snowflake className="w-8 h-8 text-[#1B87CE]" strokeWidth={2.4} />
            </div>
            <h2 className="relative mt-7 font-display text-4xl sm:text-6xl leading-[1.05] [text-shadow:4px_4px_0_rgba(0,0,0,0.3)]">
              <Sparkle className="hidden sm:block absolute w-7 h-7 left-[12%] -top-4 text-cartoon-yellow rotate-12" />
              <Sparkle className="hidden sm:block absolute w-5 h-5 right-[14%] top-10 text-cartoon-yellow -rotate-12" />
              Ready to push Legend?
            </h2>
            <p className="mt-5 mx-auto max-w-md text-paper/80 font-sans font-bold text-lg">
              Winter is always coming. Join the family and make your attacks count.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <a
                href={JOIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-paper bg-cartoon-yellow text-ink px-7 py-3.5 text-base"
              >
                Join the Clan
                <ArrowUpRight className="w-5 h-5" strokeWidth={2.6} />
              </a>
              <Link href="/leaderboard" className="btn-paper bg-white text-ink px-7 py-3.5 text-base">
                Watch the leaderboard
                <ArrowRight className="w-5 h-5" strokeWidth={2.6} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative bg-ink text-paper pt-16">
        <TornEdge fill="#FBF3E4" flip />
        <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-4 pb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 text-[14px] font-sans font-bold text-paper/60">
              <Link href="/leaderboard" className="hover:text-paper transition-colors">Legend League</Link>
              <a href={JOIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-paper transition-colors">Join in-game</a>
            </div>
            <p className="text-[12px] font-sans font-bold text-paper/35 text-center sm:text-right max-w-sm">
              Fan-made community site. Not affiliated with, endorsed or sponsored by Supercell.
            </p>
          </div>
        </div>
        {/* Giant wordmark */}
        <div className="select-none pointer-events-none pb-4" aria-hidden>
          <div className="font-display leading-[0.9] text-center text-[11vw] text-paper/95 whitespace-nowrap">
            TEAM WINTER
          </div>
        </div>
      </footer>
    </div>
  )
}
