/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ejs}"],
  theme: {
    extend: {
      fontFamily: {
        cormorant: ["'Cormorant Garamond'", 'serif'],
        kanit: ["'Kanit'", 'sans-serif'],
        noto: ["'Noto Serif'", 'serif'],
        lobster: ["'Lobster Two'", 'cursive'],
        poppins: ["'Poppins'", 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

