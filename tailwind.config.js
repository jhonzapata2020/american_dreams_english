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
          950: '#060f18',
          900: '#0F2537', // Azul Marino Institucional
          800: '#1E3A8A',
          700: '#1d4ed8',
          50: '#f0f7ff',
        },
        crimson: {
          700: '#991b1b',
          600: '#DC2626', // Rojo Bandera / Acento de Acción
          500: '#ef4444',
          50: '#fef2f2',
        },
        brand: {
          gold: '#d97706',
          goldLight: '#fef3c7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
