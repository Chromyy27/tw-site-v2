'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Clans',         href: '/#clans' },
  { label: 'CWL',           href: '/#cwl' },
  { label: 'Architects',    href: '/#architects' },
  { label: 'Recruitment',   href: '/#recruitment' },
  { label: 'Legend League', href: '/leaderboard' },
]

// Team Winter main clan — opens the clan profile in-game
export const JOIN_URL = 'https://link.clashofclans.com/en?action=OpenClanProfile&tag=232LU2U00QJ'

/**
 * Phantom-style floating pill navbar.
 * theme="light" — for pastel pages (dark ink on frosted white pill)
 * theme="dark"  — for the leaderboard (frosted glass on deep navy)
 */
export default function Navbar({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const light = theme === 'light'

  const isActive = (href: string) => !href.startsWith('/#') && pathname === href

  return (
    <>
      {/* ---------------- Floating pill navbar ---------------- */}
      <div className="sticky top-0 z-40 px-3 sm:px-4 pt-3 sm:pt-4">
        <nav
          className={`mx-auto max-w-6xl h-14 sm:h-16 rounded-full pl-5 sm:pl-7 pr-2.5 sm:pr-3 flex items-center justify-between
            backdrop-blur-xl transition-shadow ${
            light
              ? 'bg-white/80 ring-1 ring-black/[0.06] shadow-[0_8px_30px_-12px_rgba(15,27,51,0.25)]'
              : 'bg-white/[0.05] ring-1 ring-white/10 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]'
          }`}
        >
          {/* Brand */}
          <Link
            href="/"
            className={`font-podium font-bold uppercase text-xl sm:text-2xl tracking-wider flex-shrink-0 ${
              light ? 'text-[#0F1B33]' : 'text-frost-white'
            }`}
          >
            TEAM WINTER
          </Link>

          {/* Center links */}
          <div className="hidden lg:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-inter text-[13.5px] font-semibold transition-colors duration-200 ${
                  isActive(link.href)
                    ? light ? 'text-sky-600' : 'text-frost-ice'
                    : light
                      ? 'text-[#0F1B33]/70 hover:text-[#0F1B33]'
                      : 'text-frost-white/70 hover:text-frost-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Join pill (desktop) */}
            <a
              href={JOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden lg:flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] font-inter font-bold
                transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98] ${
                light
                  ? 'bg-[#0F1B33] text-white'
                  : 'bg-white text-[#0F1B33]'
              }`}
            >
              Join the Clan
              <ArrowUpRight className="w-4 h-4" />
            </a>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className={`lg:hidden w-11 h-11 rounded-full flex flex-col items-center justify-center space-y-1.5 ${
                light ? 'bg-[#0F1B33]' : 'bg-white/10'
              }`}
            >
              <div className={`w-5 h-0.5 rounded-full ${light ? 'bg-white' : 'bg-frost-ice'}`} />
              <div className={`w-5 h-0.5 rounded-full ${light ? 'bg-white' : 'bg-frost-ice'}`} />
              <div className={`w-3.5 h-0.5 rounded-full self-center ${light ? 'bg-white' : 'bg-frost-ice'}`} />
            </button>
          </div>
        </nav>
      </div>

      {/* ---------------- Mobile menu overlay ---------------- */}
      <div
        className={`lg:hidden fixed inset-0 z-50 backdrop-blur-sm transition-all duration-500 ${
          light ? 'bg-[#EAF4FC]/[0.98]' : 'bg-frost-deep/95'
        } ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header row */}
          <div className="flex items-center justify-between px-6 sm:px-10 py-5">
            <span className={`font-podium font-bold uppercase text-2xl tracking-wider ${
              light ? 'text-[#0F1B33]' : 'text-frost-white'
            }`}>
              TEAM WINTER
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className={`w-11 h-11 rounded-full flex items-center justify-center ${
                light ? 'bg-[#0F1B33]' : 'bg-white/10'
              }`}
            >
              <X className={`w-6 h-6 ${light ? 'text-white' : 'text-frost-ice'}`} />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 flex flex-col items-center justify-center gap-7">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`font-podium uppercase text-4xl sm:text-5xl transition-all duration-500 ${
                  isActive(link.href)
                    ? light ? 'text-sky-600' : 'text-frost-ice'
                    : light ? 'text-[#0F1B33]' : 'text-frost-white'
                }`}
                style={{
                  transitionDelay: `${i * 80 + 100}ms`,
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                }}
              >
                {link.label}
              </Link>
            ))}

            <a
              href={JOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className={`mt-4 flex items-center gap-2 rounded-full px-8 py-4 text-sm font-inter font-bold transition-all duration-500 ${
                light ? 'bg-[#0F1B33] text-white' : 'bg-white text-[#0F1B33]'
              }`}
              style={{
                transitionDelay: `${NAV_LINKS.length * 80 + 100}ms`,
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              Join the Clan
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
