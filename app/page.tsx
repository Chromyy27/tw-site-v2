'use client'

import { Fragment, useEffect, useState } from 'react'
import {
  Snowflake, Star, ChevronDown,
  BarChart3, BookOpen, Users, Rocket, Check,
  Shield, Trophy, MessageCircle, Activity,
  type LucideIcon,
} from 'lucide-react'

type TabId = 'analyse' | 'train' | 'testing' | 'deploy'
interface TabItem { id: TabId; label: string; Icon: LucideIcon }

const TABS: TabItem[] = [
  { id: 'analyse', label: 'Analyse', Icon: BarChart3 },
  { id: 'train',   label: 'Train',   Icon: BookOpen  },
  { id: 'testing', label: 'Testing', Icon: Users     },
  { id: 'deploy',  label: 'Deploy',  Icon: Rocket    },
]

const APPS = [
  {
    label: 'Clans',
    Icon: Shield,
    grad: 'linear-gradient(145deg,#60a5fa 0%,#1d4ed8 100%)',
    glow: 'rgba(59,130,246,0.75)', glowSoft: 'rgba(59,130,246,0.28)',
    delay: '0s',
  },
  {
    label: 'eSports',
    Icon: Trophy,
    grad: 'linear-gradient(145deg,#c084fc 0%,#6d28d9 100%)',
    glow: 'rgba(139,92,246,0.75)', glowSoft: 'rgba(139,92,246,0.28)',
    delay: '0.5s',
  },
  {
    label: 'Socials',
    Icon: MessageCircle,
    grad: 'linear-gradient(145deg,#4ade80 0%,#15803d 100%)',
    glow: 'rgba(74,222,128,0.75)', glowSoft: 'rgba(74,222,128,0.28)',
    delay: '1s',
  },
  {
    label: 'Stats',
    Icon: Activity,
    grad: 'linear-gradient(145deg,#fb923c 0%,#c2410c 100%)',
    glow: 'rgba(251,146,60,0.75)', glowSoft: 'rgba(251,146,60,0.28)',
    delay: '1.5s',
  },
  {
    label: 'TWA',
    Icon: Snowflake,
    grad: 'linear-gradient(145deg,#64748b 0%,#0f172a 100%)',
    glow: 'rgba(100,116,139,0.65)', glowSoft: 'rgba(148,163,184,0.25)',
    delay: '2s',
  },
]

function AnalyseOverlay() {
  return (
    <div className="animate-fade-in-overlay absolute inset-0 bg-black/50">
      <div className="animate-slide-up-overlay absolute bg-white rounded-2xl p-6 w-72 shadow-2xl"
        style={{ left:'50%', top:'50%', transform:'translate(-50%,-50%)' }}>
        <h3 className="font-semibold text-gray-900 mb-1">Set Up Your AI Workspace</h3>
        <p className="text-xs text-gray-500 mb-4">Step 1 of 4</p>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-5">
          <div className="bg-sky-400 h-1.5 rounded-full" style={{ width:'25%' }} />
        </div>
        <div className="space-y-3">
          {[{l:'Configure workspace',d:true},{l:'Connect your tools',d:false},{l:'Train your model',d:false},{l:'Deploy pipeline',d:false}]
            .map(({l,d},i)=>(
              <div key={i} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${d?'bg-sky-400':'border-2 border-gray-300'}`}>
                  {d&&<Check size={12} className="text-white" />}
                </div>
                <span className={`text-sm ${d?'text-gray-900 font-medium':'text-gray-400'}`}>{l}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

function TrainOverlay() {
  return (
    <div className="animate-fade-in-overlay absolute inset-0 bg-black/50">
      <div className="animate-slide-up-overlay absolute bg-white rounded-2xl p-6 w-72 shadow-2xl"
        style={{ left:'50%', top:'50%', transform:'translate(-50%,-50%)' }}>
        <h3 className="font-semibold text-gray-900 mb-1">AI Model Training</h3>
        <p className="text-xs text-gray-500 mb-4">Epoch 134 / 200</p>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-5">
          <div className="bg-orange-500 h-1.5 rounded-full" style={{ width:'67%' }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[{l:'Accuracy',v:'94.2%',c:'text-orange-500'},{l:'Loss',v:'0.043',c:'text-orange-500'},{l:'Epochs',v:'134/200',c:'text-gray-700'},{l:'Speed',v:'1.2k/s',c:'text-gray-700'}]
            .map(({l,v,c})=>(
              <div key={l} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">{l}</p>
                <p className={`text-sm font-semibold ${c}`}>{v}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

function TestingOverlay() {
  return (
    <div className="animate-fade-in-overlay absolute inset-0 bg-black/50">
      <div className="animate-slide-up-overlay absolute bg-white rounded-2xl p-6 w-72 shadow-2xl"
        style={{ left:'50%', top:'50%', transform:'translate(-50%,-50%)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <Check size={20} className="text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Test Suite Results</h3>
            <p className="text-xs text-green-600">All tests passed</p>
          </div>
        </div>
        <div className="space-y-2">
          {[{s:'Unit Tests',c:'48/48'},{s:'Integration Tests',c:'52/52'},{s:'E2E Tests',c:'27/27'}]
            .map(({s,c})=>(
              <div key={s} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{s}</span>
                <span className="text-sm font-medium text-green-600">{c}</span>
              </div>
            ))}
        </div>
        <div className="mt-4 text-center">
          <span className="text-2xl font-bold text-green-600">127/127</span>
          <p className="text-xs text-gray-500 mt-0.5">tests passing</p>
        </div>
      </div>
    </div>
  )
}

function DeployOverlay() {
  return (
    <div className="animate-fade-in-overlay absolute inset-0 bg-black/50">
      <div className="animate-slide-up-overlay absolute bg-white rounded-2xl p-6 w-72 shadow-2xl"
        style={{ left:'50%', top:'50%', transform:'translate(-50%,-50%)' }}>
        <h3 className="font-semibold text-gray-900 mb-4">Deploy to Production</h3>
        <div className="space-y-3 mb-5">
          {['Build completed successfully','Environment variables set','Database migrations run','Health checks passing']
            .map((item,i)=>(
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-white" />
                </div>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
        </div>
        <button className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
          Deploy Now
        </button>
      </div>
    </div>
  )
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabId>('analyse')

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
      style={{ background: 'linear-gradient(180deg,#ffffff 0%,#f4f7ff 70%,#eef2ff 100%)' }}
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
          <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-black transition-colors">Solutions <ChevronDown size={14}/></button>
          <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-black transition-colors">For Teams <ChevronDown size={14}/></button>
          <button className="text-sm text-gray-700 hover:text-black transition-colors">About Us</button>
          <button className="text-sm text-gray-700 hover:text-black transition-colors">Learn Hub</button>
        </nav>
        <div className="flex items-center gap-4">
          <button className="text-sm text-gray-700 hover:text-black transition-colors">Login</button>
          <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">Get started free</button>
        </div>
      </div>

      {/* ─ Hero ─ */}
      <section className="flex-1 min-h-0 flex flex-col items-center px-6 pt-4 pb-2 text-center overflow-hidden max-w-5xl w-full mx-auto gap-3">
        <div className="animate-fade-in-up flex-shrink-0 inline-flex items-center gap-2"
          style={{ animationDelay:'0.2s', opacity:0 }}>
          <div className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center">
            <Star size={12} className="fill-black" />
          </div>
          <span className="text-sm font-medium text-black">4.9 rating from 18.3K+ users</span>
        </div>

        <h1 className="animate-fade-in-up flex-shrink-0 text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-tight"
          style={{ animationDelay:'0.3s', opacity:0 }}>
          Work Together. Stay Aligned.
          <br />
          <span className="bg-gradient-to-r from-black via-gray-500 to-gray-400 bg-clip-text text-transparent">
            Team Winter Powers Your Work.
          </span>
        </h1>

        <p className="animate-fade-in-up flex-shrink-0 text-sm md:text-base text-gray-600 max-w-xl"
          style={{ animationDelay:'0.4s', opacity:0 }}>
          Intelligent collaboration tools that sync with everything your team uses to streamline workflows, boost productivity, and save time.
        </p>

        <button
          className="animate-fade-in-up flex-shrink-0 bg-black text-white px-7 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          style={{ animationDelay:'0.5s', opacity:0 }}>
          Begin Free Trial
        </button>

        <div className="animate-fade-in-up flex-shrink-0 flex justify-center w-full"
          style={{ animationDelay:'0.6s', opacity:0 }}>
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

        <div
          className="animate-fade-in-up relative rounded-2xl overflow-hidden w-full flex-1 min-h-0"
          style={{ animationDelay:'0.7s', opacity:0 }}>
          <video className="w-full h-full object-cover"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_165750_358b1e72-c921-48b7-aaac-f200994f32fb.mp4"
            autoPlay loop muted playsInline />
          {activeTab==='analyse'&&<AnalyseOverlay />}
          {activeTab==='train'  &&<TrainOverlay />}
          {activeTab==='testing'&&<TestingOverlay />}
          {activeTab==='deploy' &&<DeployOverlay />}
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
