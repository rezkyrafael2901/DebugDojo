import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#070A13',
        panel: '#0D1326',
        card: '#111A33',
        cyan: '#00E5FF',
        lime: '#8BFF6A',
        gold: '#FFD166',
        rose: '#FF4D8D',
        violet: '#8B5CF6'
      },
      boxShadow: {
        neon: '0 0 30px rgba(0,229,255,.25)',
        lime: '0 0 30px rgba(139,255,106,.20)'
      }
    }
  },
  plugins: []
}

export default config
