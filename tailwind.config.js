/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nile: {
          darkgreen: '#123D2F',
          brightgreen: '#9FE870',
          softmint: '#EAF8EF',
          bg: '#F6FAF7',
          dark: '#10231B',
          muted: '#5F6F68',
          border: '#DDE7E1',
          success: '#16A34A',
          warning: '#F59E0B',
          error: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

