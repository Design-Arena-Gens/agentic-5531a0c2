import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        hud: {
          bg: '#0a0f1f',
          ring: '#00e0ff',
          accent: '#ff3cac'
        }
      },
      boxShadow: {
        hud: '0 0 20px rgba(0, 224, 255, 0.3)'
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(0,224,255,0.7)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 20px rgba(0,224,255,0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(0,224,255,0)' }
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        pulseRing: 'pulseRing 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        spinSlow: 'spinSlow 20s linear infinite'
      }
    }
  },
  plugins: []
}

export default config
