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
        'bomb': {
          '0%': { opacity: '100%' },
          '10%': { opacity: '100%' },
          '100%': { opacity: '0%' }
        }
      },
      animation: {
        bomb: 'bomb 3s linear forwards'
      }
    },
  },
  plugins: [],
}

