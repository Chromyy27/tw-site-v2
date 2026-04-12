import Image from 'next/image'
import {
  Sparkles,
  Download,
  Wand2,
  BookOpen,
  ArrowRight,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
  type LucideIcon,
} from 'lucide-react'

interface SocialLink {
  Icon: LucideIcon
  href: string
}

const socialLinks: SocialLink[] = [
  { Icon: Twitter, href: '#' },
  { Icon: Linkedin, href: '#' },
  { Icon: Instagram, href: '#' },
]

export default function BloomHero() {
  return (
    <div className="relative flex flex-row min-h-screen overflow-hidden bg-black">
      {/* ─── Video Background ─── */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* ─── Left Panel ─── */}
      <div className="relative w-full lg:w-[52%] z-10 flex flex-col min-h-screen">
        <div className="liquid-glass-strong absolute inset-4 lg:inset-6 rounded-3xl" />

        <div className="relative z-10 flex flex-col flex-1 px-10 lg:px-14 py-10 lg:py-12">
          {/* Nav */}
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.svg"
                width={32}
                height={32}
                alt="Bloom logo"
                className="drop-shadow-sm"
              />
              <span className="font-display font-semibold text-2xl tracking-tighter text-white">
                bloom
              </span>
            </div>
            <button className="liquid-glass rounded-full px-4 py-2 flex items-center gap-2 text-white/80 text-sm hover:scale-105 transition-transform">
              <Menu size={16} />
              <span>Menu</span>
            </button>
          </nav>

          {/* Hero Center */}
          <div className="flex-1 flex flex-col items-center justify-center gap-8 text-center py-10">
            <Image
              src="/logo.svg"
              width={80}
              height={80}
              alt="Bloom"
              className="drop-shadow-lg"
            />

            <h1 className="font-display font-medium text-6xl lg:text-7xl tracking-[-0.05em] text-white leading-none">
              Innovating the
              <br />
              spirit of{' '}
              <em className="font-serif text-white/80">bloom</em> AI
            </h1>

            <button className="liquid-glass-strong rounded-full px-7 py-3.5 flex items-center gap-3 text-white hover:scale-105 active:scale-95 transition-transform">
              <span className="font-display font-medium tracking-wide">Explore Now</span>
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                <Download size={13} />
              </div>
            </button>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {['Artistic Gallery', 'AI Generation', '3D Structures'].map((label) => (
                <span
                  key={label}
                  className="liquid-glass rounded-full px-4 py-2 text-xs text-white/80"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="flex flex-col gap-3">
            <p className="text-xs tracking-widest uppercase text-white/50">
              VISIONARY DESIGN
            </p>
            <p className="text-lg leading-relaxed">
              <span className="font-display text-white">
                &ldquo;We imagined a realm{' '}
              </span>
              <em className="font-serif italic text-white/80">with no ending.</em>
              <span className="font-display text-white">&rdquo;</span>
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-xs tracking-widest uppercase text-white/50 whitespace-nowrap">
                MARCUS AURELIO
              </span>
              <div className="flex-1 h-px bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right Panel (desktop only) ─── */}
      <div className="hidden lg:flex w-[48%] flex-col min-h-screen z-10 p-6 gap-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="liquid-glass rounded-full px-3 py-2 flex items-center gap-1.5">
            {socialLinks.map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="text-white hover:text-white/80 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Icon size={14} />
                </div>
              </a>
            ))}
            <div className="w-px h-5 bg-white/20 mx-1" />
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <ArrowRight size={14} className="text-white/60" />
            </div>
          </div>

          <button className="liquid-glass rounded-full p-1.5 flex items-center gap-2 text-white hover:scale-105 transition-transform">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Sparkles size={14} />
            </div>
          </button>
        </div>

        {/* Community card */}
        <div className="liquid-glass rounded-2xl p-5 w-56">
          <h3 className="font-display font-medium text-white text-sm leading-snug">
            Enter our ecosystem
          </h3>
          <p className="text-white/60 text-xs mt-2 leading-relaxed">
            Join the growing community of AI-powered floral designers crafting
            the future of bloom.
          </p>
        </div>

        {/* Bottom feature section */}
        <div className="mt-auto liquid-glass rounded-[2.5rem] p-4 flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="liquid-glass rounded-3xl flex-1 p-4 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Wand2 size={14} className="text-white" />
              </div>
              <div>
                <p className="font-display font-medium text-white text-sm">Processing</p>
                <p className="text-white/50 text-xs mt-0.5">Neural render pipeline</p>
              </div>
            </div>

            <div className="liquid-glass rounded-3xl flex-1 p-4 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <BookOpen size={14} className="text-white" />
              </div>
              <div>
                <p className="font-display font-medium text-white text-sm">Growth Archive</p>
                <p className="text-white/50 text-xs mt-0.5">10k+ plant species</p>
              </div>
            </div>
          </div>

          <div className="liquid-glass rounded-3xl p-4 flex items-center gap-4">
            <div className="relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src="/hero-flowers.svg"
                fill
                alt="Advanced Plant Sculpting"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-display font-medium text-white text-sm">
                Advanced Plant Sculpting
              </h4>
              <p className="text-white/60 text-xs mt-1 leading-relaxed">
                AI-driven morphology for complex floral arrangements.
              </p>
            </div>
            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-lg font-light hover:scale-105 transition-transform flex-shrink-0">
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
