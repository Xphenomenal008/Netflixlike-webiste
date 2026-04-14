import tailwindScrollbarHide from 'tailwind-scrollbar-hide'
/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Netflix-inspired color palette
        'netflix-red': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#e50914', // Netflix Primary Red
        },
        'netflix-bg': {
          dark: '#000000',
          card: 'rgba(34, 31, 31, 0.6)',
          hover: 'rgba(196, 31, 50, 0.2)',
        }
      },
      animation: {
        "spin-slow": "spin 6s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      transitionDuration: {
        "200": "200ms",
        "300": "300ms",
        "500": "500ms",
      },
      spacing: {
        safe: "env(safe-area-inset-bottom)",
      },
      fontFamily: {
        netflix: ["'Segoe UI'", "'Helvetica Neue'", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      }
    },
  },
  plugins: [tailwindScrollbarHide],
}