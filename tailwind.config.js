/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        gray: {
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
}
