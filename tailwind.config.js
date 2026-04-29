/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        nebula: {
          50: '#f5f3ff',
          100: '#ece7fe',
          200: '#d3cafe',
          300: '#b39ffb',
          400: '#8e6df6',
          500: '#6c3eee',
          600: '#5a24dc',
          700: '#4b1bba',
          800: '#3f1998',
          900: '#2a0f6b',
          950: '#1a0942'
        }
      },
      fontFamily: {
        mystic: ['"Noto Serif SC"', 'Cormorant Garamond', 'serif'],
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        orb: '0 0 40px rgba(180, 150, 255, 0.35), inset 0 0 30px rgba(255, 255, 255, 0.25)',
        card: '0 10px 30px rgba(10, 5, 40, 0.45)'
      },
      animation: {
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        twinkle: 'twinkle 4s ease-in-out infinite'
      },
      keyframes: {
        floatSlow: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        twinkle: {
          '0%,100%': { opacity: 0.3 },
          '50%': { opacity: 1 }
        }
      }
    }
  },
  plugins: []
};
