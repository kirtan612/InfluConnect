/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Outfit', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#1a202c',
          primary: '#1a202c',
          secondary: '#5b6ef5',
          accent: '#17a398',
          light: '#ffffff',
        },
        slate: {
          50: '#f7f9fb',
          100: '#F1F5F9',
          800: '#1E293B',
          900: '#1a202c',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #17a398 0deg, #5b6ef5 180deg, #17a398 360deg)',
        'mesh-light': 'radial-gradient(at 0% 0%, rgba(23, 163, 152, 0.05) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(91, 110, 245, 0.05) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(23, 163, 152, 0.05) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(91, 110, 245, 0.05) 0px, transparent 50%)',
      }
    },
  },
  plugins: [],
}
