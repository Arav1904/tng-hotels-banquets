/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdfaf0',
          100: '#faf3d0',
          200: '#f3e49a',
          300: '#e9cf5e',
          400: '#ddb92c',
          500: '#c9a227',
          600: '#a8821b',
          700: '#866318',
          800: '#6e501a',
          900: '#5c431a',
        },
        charcoal: {
          50:  '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#1a1a1a',
        },
        cream: '#faf8f2',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Jost"', 'system-ui', 'sans-serif'],
        accent: ['"Cinzel"', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
        'slide-in-right': 'slideInRight 0.5s ease forwards',
        'ken-burns': 'kenBurns 8s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(30px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: 0, transform: 'translateX(30px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        kenBurns: { from: { transform: 'scale(1)' }, to: { transform: 'scale(1.08)' } },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #c9a227 0%, #e9cf5e 50%, #c9a227 100%)',
        'dark-gradient': 'linear-gradient(180deg, rgba(26,26,26,0) 0%, rgba(26,26,26,0.85) 100%)',
      },
    },
  },
  plugins: [],
}
