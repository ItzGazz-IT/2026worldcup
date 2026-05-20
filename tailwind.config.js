/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#2E73A8',
          cyan: '#3AA0D8',
          gold: '#ffd700',
          red: '#ff4757',
        },
        dark: {
          900: '#0a0e1a',
          800: '#0f1629',
          700: '#141d35',
          600: '#1a2540',
          500: '#243050',
        }
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { textShadow: '0 0 10px #2E73A8, 0 0 20px #2E73A8' },
          '50%': { textShadow: '0 0 20px #2E73A8, 0 0 40px #2E73A8, 0 0 60px #2E73A8' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
