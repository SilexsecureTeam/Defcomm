/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        oliveLight:"#3A4A1F",
        oliveDark:"#101500"
      },
      maxWidth:{
        "peak":"1400px"
      }
    },
  },
  plugins: [],
};
