/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#030014',
        darkCard: 'rgba(10, 10, 25, 0.7)',
        darkBorder: 'rgba(255, 255, 255, 0.08)',
        brandPurple: '#6D28D9',
        brandIndigo: '#4F46E5',
        brandBlue: '#2563EB',
        brandCyan: '#06B6D4',
        brandEmerald: '#10B981',
        brandAmber: '#F59E0B',
        brandRed: '#EF4444',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-orb-1': 'floatOrb1 15s ease-in-out infinite',
        'float-orb-2': 'floatOrb2 18s ease-in-out infinite',
        'float-orb-3': 'floatOrb3 12s ease-in-out infinite',
        'grid-slide': 'gridSlide 20s linear infinite',
      },
      keyframes: {
        floatOrb1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        floatOrb2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-40px, 40px) scale(1.15)' },
        },
        floatOrb3: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-20px, -30px) scale(0.9)' },
          '66%': { transform: 'translate(40px, 20px) scale(1.05)' },
        },
        gridSlide: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(40px)' },
        }
      }
    },
  },
  plugins: [],
}
