import type { Metadata, Viewport } from 'next'
import { Luckiest_Guy, Comic_Neue, Patrick_Hand } from 'next/font/google'
import './globals.css'

const display = Luckiest_Guy({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
})

const body = Comic_Neue({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const hand = Patrick_Hand({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-hand',
})

export const metadata: Metadata = {
  title: 'Team Winter — Elite Clash of Clans War Collective',
  description:
    'Team Winter builds fierce clans and elite war bases that dominate. Home of the Team Winter clan family — live Legend League tracking across all three clans.',
  icons: { icon: '/favicon.svg' },
}

export const viewport: Viewport = {
  themeColor: '#FBF3E4',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${hand.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
