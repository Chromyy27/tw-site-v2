import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        frost: {
          ice:   '#38BDF8', // electric ice-blue, primary accent
          deep:  '#0C1E3D', // deep navy, button/panel backgrounds
          mid:   '#1E3A8A', // mid blue, hover states
          white: '#EFF6FF', // frosted off-white for body text
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        inter: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
        podium: ['"FSP DEMO - PODIUM Sharp 4.11"', 'var(--font-display)', 'var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
