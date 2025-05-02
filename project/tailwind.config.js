/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#1ED760',
        'primary-dark': '#1DB954',
        'accent-purple': '#9F73EF',
        'accent-pink': '#FF007F',
        'accent-blue': '#00C2FF',
        'dark': '#121212',
        'dark-gray': '#181818',
        'medium-gray': '#282828',
        'light-gray': '#B3B3B3',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};