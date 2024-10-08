import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Podkova', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        primary: '#07A5FF',
        secondary: '#F1F3B1'
      },
      keyframes: {
        'fall': {
          '0%': { transform: 'translate(-50%, -100%)'},
          '100%': { transform: 'translate(-50%, 100vh)'}
        },
        'bomb': {
          '0%': { opacity: '100%' },
          '10%': { opacity: '100%' },
          '100%': { opacity: '0%' }
        }
      },
      animation: {
        fall: 'fall 3s linear forwards',
        bomb: 'bomb 3s linear forwards'
      }
    },
  },
  plugins: [],
}

