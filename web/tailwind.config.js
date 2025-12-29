/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0F3460',    // Azul oscuro
          blue: '#006EB8',    // Azul brillante
          orange: '#F97316',  // Naranja oferta
          light: '#E0F2FE',   // Azul clarito
        }
      },
    },
  },
  plugins: [],
}