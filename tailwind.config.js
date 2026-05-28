/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#d4af37',
          light: '#f0d060',
          dark: '#a08020',
          muted: 'rgba(212,175,55,0.15)',
        },
        neon: {
          green: '#39ff14',
          cyan: '#00ffcc',
          pink: '#ff0077',
        },
        yse: {
          dark: '#060606',
          darker: '#030303',
          card: 'rgba(255,255,255,0.035)',
          border: 'rgba(255,255,255,0.08)',
          'deep-green': '#052e16',
          'green-mid': '#064e3b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Montserrat', 'sans-serif'],
        display: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #f0d060 50%, #d4af37 100%)',
        'gold-radial': 'radial-gradient(ellipse at center, rgba(212,175,55,0.15) 0%, transparent 70%)',
        'dark-gradient': 'linear-gradient(180deg, #060606 0%, #0a0a0a 100%)',
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(5,46,22,0.6) 0%, rgba(6,6,6,0) 70%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        'green-glow': 'radial-gradient(ellipse at center, rgba(57,255,20,0.1) 0%, transparent 70%)',
        'speaker-cone': 'radial-gradient(circle at 30% 30%, #2a2a2a 0%, #111 40%, #050505 100%)',
      },
      boxShadow: {
        gold: '0 0 30px rgba(212,175,55,0.25)',
        'gold-lg': '0 0 60px rgba(212,175,55,0.4)',
        'gold-xl': '0 0 100px rgba(212,175,55,0.5)',
        neon: '0 0 20px rgba(57,255,20,0.3)',
        glass: '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glass-sm': '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        card: '0 20px 60px rgba(0,0,0,0.5)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-medium': 'spin 8s linear infinite',
        float: 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'neon-glow': 'neonGlow 2s ease-in-out infinite',
        'eq-1': 'eq1 0.8s ease-in-out infinite',
        'eq-2': 'eq2 0.6s ease-in-out infinite',
        'eq-3': 'eq3 0.9s ease-in-out infinite',
        'eq-4': 'eq4 0.7s ease-in-out infinite',
        'eq-5': 'eq5 1.0s ease-in-out infinite',
        spotlight: 'spotlight 4s ease-in-out infinite',
        marquee: 'marquee 25s linear infinite',
        'slide-up': 'slideUp 0.5s ease forwards',
        shimmer: 'shimmer 2s linear infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGold: {
          '0%,100%': { boxShadow: '0 0 20px rgba(212,175,55,0.2)' },
          '50%': { boxShadow: '0 0 50px rgba(212,175,55,0.5)' },
        },
        neonGlow: {
          '0%,100%': { textShadow: '0 0 10px #39ff14, 0 0 20px #39ff14' },
          '50%': { textShadow: '0 0 5px #39ff14' },
        },
        eq1: { '0%,100%': { height: '20%' }, '50%': { height: '100%' } },
        eq2: { '0%,100%': { height: '60%' }, '25%': { height: '20%' }, '75%': { height: '90%' } },
        eq3: { '0%,100%': { height: '40%' }, '33%': { height: '100%' }, '66%': { height: '20%' } },
        eq4: { '0%,100%': { height: '80%' }, '40%': { height: '20%' }, '80%': { height: '60%' } },
        eq5: { '0%,100%': { height: '30%' }, '60%': { height: '100%' } },
        spotlight: {
          '0%,100%': { opacity: '0.3', transform: 'rotate(-15deg)' },
          '50%': { opacity: '0.7', transform: 'rotate(-5deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
