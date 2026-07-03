'use client'

import Link from 'next/link'
import { Swords, Trophy, ArrowUpRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { AuroraBackground, Snowfall } from '@/components/Atmosphere'

/**
 * Paste your Team Winter clip URL here (ideal: in-game raid footage, a
 * war-win moment, or a snowfall/frost atmospheric loop). While empty,
 * the animated aurora + snowfall backdrop is shown instead.
 */
const BACKGROUND_VIDEO_URL = ''

// Swap in your real numbers
const STATS: Array<[string, string]> = [
  ['150+', 'Warriors United'],
  ['95%',  'War Win Rate'],
  ['3',    'Active Clans'],
]

export default function HomePage() {
  return (
    <div className="relative h-[100svh] overflow-hidden flex flex-col text-frost-white">

      {/* ---------------- Background ---------------- */}
      <div className="absolute inset-0 -z-10">
        {BACKGROUND_VIDEO_URL ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            src={BACKGROUND_VIDEO_URL}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <AuroraBackground fixed={false} />
        )}
        {/* icy-blue legibility overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-blue-950/60 to-slate-950/90" />
      </div>
      <Snowfall zIndex="z-0" />

      {/* ---------------- Navbar + mobile menu ---------------- */}
      <Navbar />

      {/* ---------------- Hero ---------------- */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16">

        {/* Tagline */}
        <div className="animate-fade-up flex items-center gap-3 mb-6 lg:mb-8">
          <Swords className="w-4 h-4 text-frost-ice flex-shrink-0" />
          <span className="text-frost-white/70 text-xs sm:text-sm font-inter tracking-[0.3em] uppercase">
            Elite Clash of Clans War Collective
          </span>
        </div>

        {/* Main heading */}
        <h1 className="animate-fade-up-delay-1 font-podium text-frost-white uppercase leading-[0.92] tracking-tight">
          <span className="block text-[clamp(2.8rem,8vw,7rem)]">Forge.</span>
          <span className="block text-[clamp(2.8rem,8vw,7rem)]">Raid.</span>
          <span className="block text-[clamp(2.8rem,8vw,7rem)]">Conquer.</span>
        </h1>

        {/* Subtext */}
        <p className="animate-fade-up-delay-2 mt-6 lg:mt-8 text-frost-white/70 text-sm sm:text-base font-inter leading-relaxed max-w-md">
          We build fierce clans and elite war bases
          <br />
          that don&apos;t just survive wars —{' '}
          <span className="font-bold text-frost-ice">they dominate them.</span>
        </p>

        {/* CTA row */}
        <div className="animate-fade-up-delay-3 mt-8 lg:mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
          <Link
            href="/leaderboard"
            className="group flex items-center gap-2 bg-frost-deep hover:bg-frost-mid px-5 sm:px-7 py-3 sm:py-4
              text-[11px] sm:text-xs tracking-widest uppercase font-inter text-frost-white transition-colors duration-200"
          >
            VIEW OUR CLANS
            <ArrowUpRight className="w-4 h-4 text-frost-ice transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <div className="hidden sm:flex items-center gap-3">
            <Trophy className="w-8 h-8 text-frost-ice/70 flex-shrink-0" />
            <div className="text-frost-white/60 text-xs tracking-wider uppercase font-inter leading-relaxed">
              Top-Ranked
              <br />
              War Clans
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="animate-fade-up-delay-4 mt-8 sm:mt-10 lg:mt-14 flex flex-wrap gap-6 sm:gap-12 lg:gap-16">
          {STATS.map(([value, label]) => (
            <div key={label}>
              <div className="font-inter text-frost-white text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                {value}
              </div>
              <div className="text-frost-white/50 text-[9px] sm:text-xs tracking-widest uppercase mt-1 font-inter">
                {label}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
