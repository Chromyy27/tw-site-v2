'use client'

import { Fragment, useEffect, useState } from 'react'
import {
  Snowflake,
  Star,
  ChevronDown,
  BarChart3,
  BookOpen,
  Users,
  Rocket,
  Check,
  type LucideIcon,
} from 'lucide-react'

type TabId = 'analyse' | 'train' | 'testing' | 'deploy'

interface TabItem {
  id: TabId
  label: string
  Icon: LucideIcon
}

const TABS: TabItem[] = [
  { id: 'analyse', label: 'Analyse', Icon: BarChart3 },
  { id: 'train',   label: 'Train',   Icon: BookOpen  },
  { id: 'testing', label: 'Testing', Icon: Users     },
  { id: 'deploy',  label: 'Deploy',  Icon: Rocket    },
]

const CLANS = [
  'Team Winter',
  'Team Winter X',
  'Team Winter Ice',
  'Team Winter Red',
  'Team Winter Sky',
  'Team Winter 2',
  'Team Winter NXT',
]

function AnalyseOverlay() {
  return (
    <div className="animate-fade-in-overlay absolute inset-0 bg-black/50">
      <div
        className="animate-slide-up-overlay absolute bg-white rounded-2xl p-6 w-80 shadow-2xl"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <h3 className="font-semibold text-gray-900 mb-1">Set Up Your AI Workspace</h3>
        <p className="text-xs text-gray-500 mb-4">Step 1 of 4</p>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-5">
          <div className="bg-sky-400 h-1.5 rounded-full" style={{ width: '25%' }} />
        </div>
        <div className="space-y-3">
          {[
            { label: 'Configure workspace', done: true  },
            { label: 'Connect your tools',  done: false },
            { label: 'Train your model',    done: false },
            { label: 'Deploy pipeline',     done: false },
          ].map(({ label, done }, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  done ? 'bg-sky-400' : 'border-2 border-gray-300'
                }`}
              >
                {done && <Check size={12} className="text-white" />}
              </div>
              <span className={`text-sm ${done ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
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
      <div
        className="animate-slide-up-overlay absolute bg-white rounded-2xl p-6 w-80 shadow-2xl"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <h3 className="font-semibold text-gray-900 mb-1">AI Model Training</h3>
        <p className="text-xs text-gray-500 mb-4">Epoch 134 / 200</p>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-5">
          <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '67%' }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Accuracy', value: '94.2%',   color: 'text-orange-500' },
            { label: 'Loss',     value: '0.043',    color: 'text-orange-500' },
            { label: 'Epochs',   value: '134/200',  color: 'text-gray-700'   },
            { label: 'Speed',    value: '1.2k/s',   color: 'text-gray-700'   },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className={`text-sm font-semibold ${color}`}>{value}</p>
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
      <div
        className="animate-slide-up-overlay absolute bg-white rounded-2xl p-6 w-80 shadow-2xl"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
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
          {[
            { suite: 'Unit Tests',         count: '48/48'  },
            { suite: 'Integration Tests',  count: '52/52'  },
            { suite: 'E2E Tests',          count: '27/27'  },
          ].map(({ suite, count }) => (
            <div
              key={suite}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <span className="text-sm text-gray-700">{suite}</span>
              <span className="text-sm font-medium text-green-600">{count}</span>
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
      <div
        className="animate-slide-up-overlay absolute bg-white rounded-2xl p-6 w-80 shadow-2xl"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <h3 className="font-semibold text-gray-900 mb-4">Deploy to Production</h3>
        <div className="space-y-3 mb-5">
          {[
            'Build completed successfully',
            'Environment variables set',
            'Database migrations run',
            'Health checks passing',
          ].map((item, i) => (
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
      setActiveTab((prev) => {
        const idx = TABS.findIndex((t) => t.id === prev)
        return TABS[(idx + 1) % TABS.length].id
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white min-h-screen">
      {/* ─── Navigation ─── */}
      <div
        className="animate-fade-in-up px-6 py-4 flex items-center justify-between max-w-7xl mx-auto"
        style={{ animationDelay: '0.1s', opacity: 0 }}
      >
        <div className="flex items-center gap-2">
          <Snowflake className="w-5 h-5" />
          <span className="text-lg font-semibold">Team Winter</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-black transition-colors">
            Solutions <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-black transition-colors">
            For Teams <ChevronDown size={14} />
          </button>
          <button className="text-sm text-gray-700 hover:text-black transition-colors">About Us</button>
          <button className="text-sm text-gray-700 hover:text-black transition-colors">Learn Hub</button>
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-sm text-gray-700 hover:text-black transition-colors">Login</button>
          <button className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            Get started free
          </button>
        </div>
      </div>

      {/* ─── Hero ─── */}
      <section className="px-6 pt-24 pb-32 max-w-7xl mx-auto text-center">
        {/* Rating badge */}
        <div
          className="animate-fade-in-up inline-flex items-center gap-2 mb-8"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          <div className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center">
            <Star size={12} className="fill-black" />
          </div>
          <span className="text-sm font-medium text-black">4.9 rating from 18.3K+ users</span>
        </div>

        {/* Heading */}
        <h1
          className="animate-fade-in-up text-6xl md:text-7xl lg:text-[80px] font-normal leading-[1.1] tracking-tight mb-5"
          style={{ animationDelay: '0.3s', opacity: 0 }}
        >
          Work Together. Stay Aligned.
          <br />
          <span className="bg-gradient-to-r from-black via-gray-500 to-gray-400 bg-clip-text text-transparent">
            Team Winter Powers Your Work.
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="animate-fade-in-up text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          style={{ animationDelay: '0.4s', opacity: 0 }}
        >
          Intelligent collaboration tools that sync with everything your team uses to streamline
          workflows, boost productivity, and save time.
        </p>

        {/* CTA */}
        <button
          className="animate-fade-in-up bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors mb-12"
          style={{ animationDelay: '0.5s', opacity: 0 }}
        >
          Begin Free Trial
        </button>

        {/* Tab Bar */}
        <div
          className="animate-fade-in-up flex justify-center mb-6"
          style={{ animationDelay: '0.6s', opacity: 0 }}
        >
          {/* Mobile: 2×2 grid */}
          <div className="md:hidden bg-gray-100 rounded-lg p-1 grid grid-cols-2 gap-1 w-full max-w-xs">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Desktop: row with dividers */}
          <div className="hidden md:flex bg-gray-100 rounded-lg p-1 items-center">
            {TABS.map(({ id, label, Icon }, i) => (
              <Fragment key={id}>
                <button
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === id
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
                {i < TABS.length - 1 && (
                  <div className="w-px h-5 bg-gray-300 mx-0.5" />
                )}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Video + Overlay */}
        <div
          className="animate-fade-in-up relative rounded-3xl overflow-hidden h-[400px] md:h-[500px]"
          style={{ animationDelay: '0.7s', opacity: 0 }}
        >
          <video
            className="w-full h-full object-cover"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_165750_358b1e72-c921-48b7-aaac-f200994f32fb.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          {activeTab === 'analyse' && <AnalyseOverlay />}
          {activeTab === 'train'   && <TrainOverlay />}
          {activeTab === 'testing' && <TestingOverlay />}
          {activeTab === 'deploy'  && <DeployOverlay />}
        </div>

        {/* Clan names */}
        <div
          className="animate-fade-in-up mt-24 flex items-center justify-center gap-8 md:gap-10 flex-wrap"
          style={{ animationDelay: '0.8s', opacity: 0 }}
        >
          {CLANS.map((clan, i) => (
            <Fragment key={clan}>
              <span className="text-sm font-semibold tracking-wide text-gray-400 whitespace-nowrap">
                {clan}
              </span>
              {i < CLANS.length - 1 && (
                <div className="w-px h-4 bg-gray-200 hidden md:block" />
              )}
            </Fragment>
          ))}
        </div>
      </section>
    </div>
  )
}
