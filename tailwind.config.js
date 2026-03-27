/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ["Fredoka", "sans-serif"],
        lexend: ["Lexend", "sans-serif"],
        genty: ["Genty Sans", "cursive"],
      },
    },
  },
  plugins: [],
}