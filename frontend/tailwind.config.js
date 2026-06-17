/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom enterprise color palette
        brand: {
          50: '#f5f7fa',
          100: '#e4ebf4',
          200: '#c5d5e9',
          300: '#96b6da',
          400: '#6091c7',
          500: '#3c72ac',
          600: '#2c5a8f',
          700: '#254975',
          800: '#213f63',
          900: '#1e3654',
          950: '#142337',
        },
        risk: {
          low: '#10b981',     // emerald-500
          medium: '#f59e0b',  // amber-500
          high: '#ef4444',    // red-500
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
