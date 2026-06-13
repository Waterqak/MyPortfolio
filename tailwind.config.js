/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 86-inspired palette
        steel: {
          900: '#070809',
          800: '#0D0F14',
          700: '#13161D',
          600: '#1A1D26',
        },
        crimson: {
          DEFAULT: '#B91C1C',
          bright: '#DC2626',
          muted: 'rgba(185, 28, 28, 0.15)',
        },
        silver: {
          DEFAULT: '#94A3B8',
          muted: '#64748B',
          bright: '#CBD5E1',
        },
        brass: {
          DEFAULT: '#A16207',
          bright: '#CA8A04',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'],
      },
      spacing: {
        'nav': 'var(--nav-height)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out both',
        'slide-right': 'slideInRight 0.5s ease-out both',
        'float': 'floatUp 4s ease-in-out infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
