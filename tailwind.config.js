/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        oliveLight:"#36460A",
        oliveDark:"#101500",
        olive:"#759719",
        oliveGreen:"#DDF2AB",
        oliveGreen:"#89AF20",
        oliveHover:"#C6FC2B",
        yellow:"#CDB30A"
      },
      maxWidth:{
        "peak":"1400px"
      }
    },
  },
  plugins: [],
};
