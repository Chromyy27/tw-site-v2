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

/** Paper-cutout pill navbar shared by every page. */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => !href.startsWith('/#') && pathname === href

  return (
    <>
      {/* ---------------- Floating paper pill ---------------- */}
      <div className="sticky top-0 z-40 px-3 sm:px-4 pt-3 sm:pt-4">
        <nav className="mx-auto max-w-6xl h-14 sm:h-16 rounded-full bg-paper-warm border-[3px] border-ink
          shadow-[5px_5px_0_0_#2B2B2B] pl-5 sm:pl-7 pr-2.5 sm:pr-3 flex items-center justify-between relative">

          {/* Brand */}
          <Link
            href="/"
            className="font-display text-xl sm:text-2xl tracking-wide text-ink flex-shrink-0 pt-1"
          >
            TEAM WINTER
          </Link>

          {/* Center links */}
          <div className="hidden lg:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-sans text-[15px] font-bold transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-[#1B87CE] underline decoration-wavy decoration-2 underline-offset-4'
                    : 'text-ink/60 hover:text-ink'
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
              className="hidden lg:inline-flex btn-paper bg-cartoon-yellow text-ink px-5 py-2 text-sm"
            >
              Join the Clan
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.6} />
            </a>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="lg:hidden btn-paper bg-white w-11 h-11 !p-0 flex-col !gap-0 space-y-1.5"
            >
              <div className="w-5 h-[3px] rounded-full bg-ink" />
              <div className="w-5 h-[3px] rounded-full bg-ink" />
              <div className="w-3.5 h-[3px] rounded-full bg-ink" />
            </button>
          </div>
        </nav>
      </div>

      {/* ---------------- Mobile menu overlay ---------------- */}
      <div
        className={`lg:hidden fixed inset-0 z-50 bg-paper/[0.98] transition-all duration-500 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header row */}
          <div className="flex items-center justify-between px-6 sm:px-10 py-5">
            <span className="font-display text-2xl tracking-wide text-ink pt-1">TEAM WINTER</span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="btn-paper bg-white w-11 h-11 !p-0"
            >
              <X className="w-6 h-6 text-ink" strokeWidth={2.6} />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 flex flex-col items-center justify-center gap-7">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`font-display text-4xl sm:text-5xl transition-all duration-500 ${
                  isActive(link.href) ? 'text-[#1B87CE]' : 'text-ink'
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
              className="mt-4 btn-paper bg-cartoon-yellow text-ink px-8 py-4 text-base"
              style={{
                transitionDelay: `${NAV_LINKS.length * 80 + 100}ms`,
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              Join the Clan
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.6} />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
