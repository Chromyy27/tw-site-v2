import type { Metadata } from 'next'
import { Poppins, Source_Serif_4 } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-poppins',
  display: 'swap',
})

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-source-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bloom — AI Floral Design',
  description:
    'Innovating the spirit of bloom with AI-powered plant and floral design.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${sourceSerif4.variable}`}
    >
      <body className="font-display antialiased bg-black">{children}</body>
    </html>
  )
}
