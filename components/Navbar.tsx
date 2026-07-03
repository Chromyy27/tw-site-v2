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

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => !href.startsWith('/#') && pathname === href

  return (
    <>
      {/* ---------------- Navbar ---------------- */}
      <header className="relative z-30 px-6 sm:px-10 lg:px-16 py-5 lg:py-7">
        <nav className="flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="font-podium font-bold uppercase text-2xl sm:text-3xl tracking-wider text-frost-white flex-shrink-0">
            TEAM WINTER
          </Link>

          {/* Center links */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-inter text-sm tracking-widest uppercase transition-colors duration-200 ${
                  isActive(link.href) ? 'text-frost-ice' : 'text-frost-white/80 hover:text-frost-ice'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Join button (desktop) */}
          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 border border-frost-ice/30 hover:border-frost-ice/60 hover:bg-frost-ice/10
              px-6 py-3 text-xs tracking-widest uppercase font-inter text-frost-white transition-all duration-200"
          >
            JOIN THE CLAN
            <ArrowUpRight className="w-4 h-4 text-frost-ice" />
          </a>

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="lg:hidden space-y-1.5 p-1"
          >
            <div className="w-6 h-0.5 bg-frost-ice" />
            <div className="w-6 h-0.5 bg-frost-ice" />
            <div className="w-4 h-0.5 bg-frost-ice" />
          </button>
        </nav>
      </header>

      {/* ---------------- Mobile menu overlay ---------------- */}
      <div
        className={`lg:hidden fixed inset-0 z-50 bg-frost-deep/95 backdrop-blur-sm transition-all duration-500 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header row */}
          <div className="flex items-center justify-between px-6 sm:px-10 py-5">
            <span className="font-podium font-bold uppercase text-2xl sm:text-3xl tracking-wider text-frost-white">
              TEAM WINTER
            </span>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="p-1">
              <X className="w-7 h-7 text-frost-ice" />
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
                  isActive(link.href) ? 'text-frost-ice' : 'text-frost-white'
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
              className="mt-4 flex items-center gap-2 border border-frost-ice/30 hover:border-frost-ice/60 hover:bg-frost-ice/10
                px-8 py-4 text-xs tracking-widest uppercase font-inter text-frost-white transition-all duration-500"
              style={{
                transitionDelay: `${NAV_LINKS.length * 80 + 100}ms`,
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              JOIN THE CLAN
              <ArrowUpRight className="w-4 h-4 text-frost-ice" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
