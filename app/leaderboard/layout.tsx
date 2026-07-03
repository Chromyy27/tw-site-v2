import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Legend League Live — Team Winter',
  description:
    'Real-time Legend League trophy tracker for the Team Winter clan family. Live trophies, daily gains and attacks across all three clans.',
}

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
