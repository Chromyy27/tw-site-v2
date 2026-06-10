'use client'

import { ArrowRight, Globe, Play, Snowflake } from 'lucide-react'
import { BoomerangVideoBg } from '@/components/boomerang-video-bg'
import { FadeDown } from '@/components/fade-down'
import { StaggeredFade } from '@/components/staggered-fade'

export default function Page() {
  return (
    <div className="h-screen flex flex-col bg-[#F5FAFD] relative overflow-hidden">
      <div className="fixed inset-0 z-0" style={{ top: 200 }}>
        <BoomerangVideoBg />
      </div>

      <nav className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 relative z-10">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 h-6 md:h-7">
            <Snowflake className="w-5 h-5 md:w-6 md:h-6 text-[#0F2A44]" />
            <span className="text-[#0F2A44] font-bold tracking-tight-custom text-base md:text-lg">
              Team Winter
            </span>
          </div>
          <button className="hidden md:flex items-center gap-1 text-sm text-[#0F2A44]">
            <Globe className="w-4 h-4" />
            En
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {['Clans', 'Events', 'CWL', 'Basepacks', 'Leaderboards'].map(item => (
            <a key={item} href="#" className="text-sm text-slate-600 hover:text-slate-900">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href="#"
            className="hidden sm:block text-sm text-slate-600 hover:text-slate-900 border border-[#0F2A44]/20 px-4 md:px-6 py-2 md:py-2.5 rounded-full transition-colors"
          >
            Sign In
          </a>
          <a
            href="#"
            className="px-4 md:px-6 py-2 md:py-2.5 bg-[#0F2A44] text-white text-sm rounded-full hover:bg-[#16395C] transition-colors"
          >
            Join Discord
          </a>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center px-4 md:px-8 relative pt-4 md:pt-8">
        <div className="relative z-10 flex flex-col items-center">
          <FadeDown className="mb-3 px-3 md:px-4 py-1.5 md:py-2 border border-[#0F2A44]/20 rounded-full flex items-center gap-1.5 md:gap-2 text-xs md:text-sm bg-white/40 backdrop-blur-sm">
            <span>❄️</span>
            <ArrowRight className="w-3 h-3 text-[#0F2A44]/70" />
            <span>⚔️</span>
            <span className="hidden sm:inline text-[#0F2A44]">Dominating leagues worldwide</span>
            <span className="sm:hidden text-[#0F2A44]">Winter dominates</span>
            <ArrowRight className="w-3 h-3 text-[#0F2A44]/70" />
            <span>🏆</span>
          </FadeDown>

          <StaggeredFade
            text="Forged In Ice, Built For War, One Winter Family"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-normal text-center max-w-5xl mb-3 md:mb-4 px-4"
            style={{ color: '#1B3A5C' }}
          />

          <FadeDown delay={0.5}>
            <p className="text-center text-slate-500 max-w-3xl mb-4 md:mb-5 text-sm md:text-base lg:text-lg px-4">
              Competitive Clash of Clans Ecosystem. Multiple clans, elite CWL rosters, pro-level basepacks,
              and community events for players at every level worldwide.
            </p>
          </FadeDown>

          <FadeDown delay={0.7}>
            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 px-4">
              <a
                href="#"
                className="pl-4 md:pl-6 pr-2 py-2 bg-gradient-to-r from-[#2E6FA8] to-[#4FA8DC] text-white rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity text-sm md:text-base"
              >
                <Snowflake className="w-4 h-4" />
                Join The Clan
                <span
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(59deg, #5FA8D6 0%, #8FD0F0 100%)' }}
                >
                  <Play className="w-3 h-3 md:w-4 md:h-4 fill-white text-white" />
                </span>
              </a>
              <a
                href="#"
                className="pl-4 md:pl-6 pr-2 py-2 bg-white text-slate-600 rounded-full flex items-center gap-2 hover:bg-slate-50 transition-colors text-sm md:text-base"
              >
                Explore Clans
                <span
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(59deg, #EAF4FA 0%, #C8DEEC 100%)' }}
                >
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4 fill-[#0F2A44] text-[#0F2A44]" />
                </span>
              </a>
            </div>
          </FadeDown>
        </div>
      </div>
    </div>
  )
}
