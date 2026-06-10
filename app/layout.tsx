import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Team Winter — Forged in Ice, Built for War',
  description:
    'Competitive Clash of Clans Ecosystem. Multiple clans, elite CWL rosters, pro-level basepacks, and community events for players at every level worldwide.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#F5FAFD]">{children}</body>
    </html>
  )
}
