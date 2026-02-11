/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Verwijder index.html (bestaat niet meer)
    "./src/app/**/*.{js,ts,jsx,tsx}",    // Belangrijk voor de nieuwe App Router!
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Hier kun je later je eigen Quantum Alpha kleuren toevoegen
    },
  },
  plugins: [],
}