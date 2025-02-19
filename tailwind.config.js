/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        oliveLight:"#36460A",
        oliveDark:"#101500"
      },
      maxWidth:{
        "peak":"1400px"
      }
    },
  },
  plugins: [],
};
