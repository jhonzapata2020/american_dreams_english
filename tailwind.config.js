/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0b1329',
          800: '#111e38',
          700: '#1d2d50',
          600: '#2a3f6d',
        },
        brand: {
          blue: '#1e3a8a',
          indigo: '#3730a3',
          accent: '#059669',
          accentLight: '#10b981',
          gold: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
