/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height',
      },
      colors: {
        'color-dark': '#483c15',
        'color-light': '#F2C846',
        'moon-light': '#a038c1',
        'moon-dark': '#483c15'
      }
    },
  },
  plugins: [],
}

