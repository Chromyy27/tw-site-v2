'use client'

import { Fragment, useEffect, useState } from 'react'
import {
  Snowflake, ChevronDown,
  Shield, Trophy, MessageCircle, Activity,
  Users, Swords, Flame, Crown, Check,
  type LucideIcon,
} from 'lucide-react'

type TabId = 'clans' | 'esports' | 'community' | 'stats'
interface TabItem { id: TabId; label: string; Icon: LucideIcon }

const TABS: TabItem[] = [
  { id: 'clans',     label: 'Clans',     Icon: Shield        },
  { id: 'esports',   label: 'eSports',   Icon: Trophy        },
  { id: 'community', label: 'Community', Icon: MessageCircle },
  { id: 'stats',     label: 'Stats',     Icon: Activity      },
]

const APPS = [
  { label: 'Clans',   Icon: Shield,         grad: 'linear-gradient(145deg,#60a5fa 0%,#1d4ed8 100%)', glow: 'rgba(59,130,246,0.75)',  glowSoft: 'rgba(59,130,246,0.28)',  delay: '0s'   },
  { label: 'eSports', Icon: Trophy,         grad: 'linear-gradient(145deg,#c084fc 0%,#6d28d9 100%)', glow: 'rgba(139,92,246,0.75)',  glowSoft: 'rgba(139,92,246,0.28)',  delay: '0.5s' },
  { label: 'Socials', Icon: MessageCircle,  grad: 'linear-gradient(145deg,#4ade80 0%,#15803d 100%)', glow: 'rgba(74,222,128,0.75)', glowSoft: 'rgba(74,222,128,0.28)', delay: '1s'   },
  { label: 'Stats',   Icon: Activity,       grad: 'linear-gradient(145deg,#fb923c 0%,#c2410c 100%)', glow: 'rgba(251,146,60,0.75)',  glowSoft: 'rgba(251,146,60,0.28)',  delay: '1.5s' },
  { label: 'TWA',     Icon: Snowflake,      grad: 'linear-gradient(145deg,#64748b 0%,#0f172a 100%)', glow: 'rgba(100,116,139,0.65)', glowSoft: 'rgba(148,163,184,0.25)', delay: '2s'   },
]

const CLANS = [
  { name: 'Team Winter',     tag: 'TW',   members: 1840, online: 312, color: '#60a5fa' },
  { name: 'Team Winter X',   tag: 'TWX',  members: 1520, online: 278, color: '#c084fc' },
  { name: 'Team Winter Ice', tag: 'TWIC', members: 1380, online: 201, color: '#67e8f9' },
  { name: 'Team Winter Red', tag: 'TWRD', members: 1290, online: 189, color: '#f87171' },
  { name: 'Team Winter Sky', tag: 'TWSK', members: 1104, online: 143, color: '#38bdf8' },
  { name: 'Team Winter 2',   tag: 'TW2',  members:  980, online: 112, color: '#a3e635' },
  { name: 'Team Winter NXT', tag: 'TWNX', members:  870, online:  98, color: '#fb923c' },
]

function ClansOverlay() {
  return (
    <div className="animate-fade-in-overlay absolute inset-0 bg-black/55">
      <div className="animate-slide-up-overlay absolute bg-white rounded-2xl p-5 w-72 shadow-2xl"
        style={{ left:'50%', top:'50%', transform:'translate(-50%,-50%)' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Active Clans</h3>
          <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full">7 clans</span>
        </div>
        <div className="space-y-2">
          {CLANS.slice(0,5).map(({ name, tag, members, online, color }) => (
            <div key={tag} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-sm font-medium text-gray-800">{name}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400">{members.toLocaleString()} members</span>
                <span className="ml-2 text-xs text-green-500 font-medium">{online} online</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">Total members</span>
          <span className="text-sm font-bold text-gray-900">{CLANS.reduce((a,c)=>a+c.members,0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

function EsportsOverlay() {
  const results = [
    { clan: 'TW',   opp: 'OpTic',  score: '2–1', win: true  },
    { clan: 'TWIC', opp: 'FaZe',   score: '3–0', win: true  },
    { clan: 'TWX',  opp: '100T',   score: '1–2', win: false },
    { clan: 'TWRD', opp: 'NRG',    score: '2–0', win: true  },
  ]
  return (
    <div className="animate-fade-in-overlay absolute inset-0 bg-black/55">
      <div className="animate-slide-up-overlay absolute bg-white rounded-2xl p-5 w-72 shadow-2xl"
        style={{ left:'50%', top:'50%', transform:'translate(-50%,-50%)' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Recent Results</h3>
          <span className="text-xs bg-purple-50 text-purple-600 font-medium px-2 py-0.5 rounded-full">Season 5</span>
        </div>
        <div className="space-y-2.5">
          {results.map(({ clan, opp, score, win }) => (
            <div key={clan+opp} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${win?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>
                  {win?'W':'L'}
                </span>
                <span className="text-sm text-gray-700 font-medium">{clan} <span className="text-gray-400 font-normal">vs</span> {opp}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{score}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">Season record</span>
          <span className="text-sm font-bold text-gray-900">38W – 14L</span>
        </div>
      </div>
    </div>
  )
}

function CommunityOverlay() {
  const posts = [
    { text: 'Season 5 tournament registration is now open!', time: '2h ago',  dot: 'bg-blue-400'   },
    { text: 'Team Winter X wins regional finals 3–0 🏆',     time: '5h ago',  dot: 'bg-purple-400' },
    { text: 'Clan Wars event happening this weekend',        time: '1d ago',  dot: 'bg-green-400'  },
    { text: 'New Team Winter merch drop — limited edition',  time: '2d ago',  dot: 'bg-orange-400' },
  ]
  return (
    <div className="animate-fade-in-overlay absolute inset-0 bg-black/55">
      <div className="animate-slide-up-overlay absolute bg-white rounded-2xl p-5 w-72 shadow-2xl"
        style={{ left:'50%', top:'50%', transform:'translate(-50%,-50%)' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Latest Updates</h3>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
        <div className="space-y-3">
          {posts.map(({ text, time, dot }, i) => (
            <div key={i} className="flex gap-2.5">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${dot}`} />
              <div>
                <p className="text-sm text-gray-800 leading-snug">{text}</p>
                <p className="text-xs text-gray-400 mt-0.5">{time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatsOverlay() {
  const metrics = [
    { label: 'Total Members', value: '10,284', color: 'text-blue-600'   },
    { label: 'Win Rate',      value: '73%',     color: 'text-green-600'  },
    { label: 'Trophies',      value: '148',      color: 'text-yellow-600' },
    { label: 'Active Clans',  value: '7',        color: 'text-purple-600' },
  ]
  return (
    <div className="animate-fade-in-overlay absolute inset-0 bg-black/55">
      <div className="animate-slide-up-overlay absolute bg-white rounded-2xl p-5 w-72 shadow-2xl"
        style={{ left:'50%', top:'50%', transform:'translate(-50%,-50%)' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Season 5 Stats</h3>
          <span className="text-xs bg-orange-50 text-orange-600 font-medium px-2 py-0.5 rounded-full">Live</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          {metrics.map(({ label, value, color }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-0.5">{label}</p>
              <p className={`text-lg font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Season goal</span><span>73 / 100 wins</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-orange-400 h-1.5 rounded-full" style={{ width:'73%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabId>('clans')

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => {
        const idx = TABS.findIndex(t => t.id === prev)
        return TABS[(idx + 1) % TABS.length].id
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="h-screen overflow-hidden flex flex-col"
      style={{ background:'linear-gradient(180deg,#ffffff 0%,#f4f7ff 70%,#eef2ff 100%)' }}
    >
      {/* ─ Nav ─ */}
      <div
        className="animate-fade-in-up flex-shrink-0 px-6 py-3 flex items-center justify-between max-w-7xl w-full mx-auto"
        style={{ animationDelay:'0.1s', opacity:0 }}
      >
        <div className="flex items-center gap-2">
          <Snowflake className="w-5 h-5" />
          <span className="text-lg font-semibold">Team Winter</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-black transition-colors">Clans <ChevronDown size={14}/></button>
          <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-black transition-colors">eSports <ChevronDown size={14}/></button>
          <button className="text-sm text-gray-700 hover:text-black transition-colors">Community</button>
          <button className="text-sm text-gray-700 hover:text-black transition-colors">Rankings</button>
        </nav>
        <div className="flex items-center gap-4">
          <button className="text-sm text-gray-700 hover:text-black transition-colors">Login</button>
          <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">Join the Clan</button>
        </div>
      </div>

      {/* ─ Hero ─ */}
      <section className="flex-1 min-h-0 flex flex-col items-center px-6 pt-4 pb-2 text-center overflow-hidden max-w-5xl w-full mx-auto gap-3">

        <div
          className="animate-fade-in-up flex-shrink-0 inline-flex items-center gap-2"
          style={{ animationDelay:'0.2s', opacity:0 }}
        >
          <div className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center">
            <Snowflake size={12} className="text-black" />
          </div>
          <span className="text-sm font-medium text-black">10K+ members &middot; 7 active clans</span>
        </div>

        <h1
          className="animate-fade-in-up flex-shrink-0 text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-tight"
          style={{ animationDelay:'0.3s', opacity:0 }}
        >
          Compete. Connect. Conquer.
          <br />
          <span className="bg-gradient-to-r from-black via-gray-500 to-gray-400 bg-clip-text text-transparent">
            Team Winter Reigns Supreme.
          </span>
        </h1>

        <p
          className="animate-fade-in-up flex-shrink-0 text-sm md:text-base text-gray-600 max-w-xl"
          style={{ animationDelay:'0.4s', opacity:0 }}
        >
          The ultimate hub for all Team Winter clans &mdash; manage your roster, track tournament results, stay connected with the community, and dominate the leaderboards.
        </p>

        <button
          className="animate-fade-in-up flex-shrink-0 bg-black text-white px-7 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          style={{ animationDelay:'0.5s', opacity:0 }}
        >
          Join the Clan
        </button>

        {/* Tab bar */}
        <div
          className="animate-fade-in-up flex-shrink-0 flex justify-center w-full"
          style={{ animationDelay:'0.6s', opacity:0 }}
        >
          <div className="md:hidden bg-gray-100 rounded-lg p-1 grid grid-cols-2 gap-1 w-full max-w-xs">
            {TABS.map(({id,label,Icon})=>(
              <button key={id} onClick={()=>setActiveTab(id)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab===id?'bg-white text-black shadow-sm':'text-gray-600 hover:text-gray-900'}`}>
                <Icon size={14}/>{label}
              </button>
            ))}
          </div>
          <div className="hidden md:flex bg-gray-100 rounded-lg p-1 items-center">
            {TABS.map(({id,label,Icon},i)=>(
              <Fragment key={id}>
                <button onClick={()=>setActiveTab(id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-all ${activeTab===id?'bg-white text-black shadow-sm':'text-gray-600 hover:text-gray-900'}`}>
                  <Icon size={14}/>{label}
                </button>
                {i<TABS.length-1&&<div className="w-px h-5 bg-gray-300 mx-0.5" />}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Video + overlays */}
        <div
          className="animate-fade-in-up relative rounded-2xl overflow-hidden w-full flex-1 min-h-0"
          style={{ animationDelay:'0.7s', opacity:0 }}
        >
          <video className="w-full h-full object-cover"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_165750_358b1e72-c921-48b7-aaac-f200994f32fb.mp4"
            autoPlay loop muted playsInline />
          {activeTab==='clans'     && <ClansOverlay />}
          {activeTab==='esports'   && <EsportsOverlay />}
          {activeTab==='community' && <CommunityOverlay />}
          {activeTab==='stats'     && <StatsOverlay />}
        </div>
      </section>

      {/* ─ App Dock ─ */}
      <div
        className="animate-fade-in-up flex-shrink-0 flex justify-center py-5 px-6"
        style={{ animationDelay:'0.8s', opacity:0 }}
      >
        <div className="ios-dock inline-flex items-end gap-5 md:gap-8 px-7 md:px-9 py-4 rounded-[36px]">
          {APPS.map(({ label, Icon, grad, glow, glowSoft, delay }) => (
            <button
              key={label}
              className="flex flex-col items-center gap-2 hover:scale-110 active:scale-95 transition-transform duration-200"
            >
              <div
                className="icon-glow ios-shine relative w-[60px] h-[60px] md:w-[68px] md:h-[68px] flex items-center justify-center overflow-hidden"
                style={{
                  borderRadius: '22px',
                  background: grad,
                  '--glow': glow,
                  '--glow-soft': glowSoft,
                  animationDelay: delay,
                } as React.CSSProperties}
              >
                <Icon size={28} className="text-white relative z-10" strokeWidth={1.6} />
              </div>
              <span className="text-[11px] font-medium text-gray-500 leading-none">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
