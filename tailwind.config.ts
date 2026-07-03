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
        ink: '#2B2B2B',
        paper: {
          DEFAULT: '#FBF3E4',
          warm: '#FFFDF5',
        },
        cartoon: {
          sky:      '#9AD3F2',
          yellow:   '#FFD95E',
          mint:     '#9FE7BC',
          peach:    '#FFB48A',
          lavender: '#C3B2F7',
          red:      '#F87B6D',
          night:    '#2F4470',
        },
        // legacy frost palette (still referenced in a few places)
        frost: {
          ice:   '#38BDF8',
          deep:  '#0C1E3D',
          mid:   '#1E3A8A',
          white: '#EFF6FF',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', '"Comic Sans MS"', 'sans-serif'],
        inter: ['var(--font-sans)', '"Comic Sans MS"', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
        podium: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
        hand: ['var(--font-hand)', 'var(--font-sans)', 'cursive'],
      },
    },
  },
  plugins: [],
}

export default config
