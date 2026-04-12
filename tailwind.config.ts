import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-poppins)', 'sans-serif'],
        serif: ['var(--font-source-serif)', 'serif'],
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '1rem',
      },
      colors: {
        background: 'hsl(0 0% 0%)',
        foreground: 'hsl(0 0% 100%)',
      },
    },
  },
  plugins: [],
}

export default config
