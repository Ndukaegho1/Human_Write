import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './lib/**/*.{js,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#f8fafc',
          muted: '#94a3b8'
        },
        glass: {
          1: 'rgba(255,255,255,0.85)',
          2: 'rgba(15,23,42,0.68)'
        }
      },
      fontFamily: {
        display: ['Inter var', 'system-ui', 'sans-serif'],
        body: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  }
}

export default config