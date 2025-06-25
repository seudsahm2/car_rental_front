/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a', // Deep blue for luxury
        secondary: '#f59e0b', // Amber for accents
        neutral: '#f3f4f6', // Light gray for backgrounds
        accent: '#10b981', // Emerald for highlights
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'custom-hover': '0 6px 20px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
