/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          navy: '#0F172A',
          teal: '#0D9488',
          indigo: '#6366F1',
        },
        gray: {
          50: '#F8FAFC',
          600: '#6B7280',
          900: '#111827',
        }
      },
    },
  },
  plugins: [],
}