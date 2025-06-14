/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          500: '#ec4899',
          600: '#db2777',
        },
        purple: {
          500: '#a855f7',
          600: '#9333ea',
        }
      },
    },
  },
  plugins: [],
}