/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        potion: {
          red: '#FF3B3F',
          blue: '#4A90E2',
          green: '#7ED321',
          purple: '#9013FE',
          yellow: '#F5A623',
          orange: '#FF6B35',
          cyan: '#50E3C2',
          pink: '#FF6BB5',
        },
      },
    },
  },
  plugins: [],
}
