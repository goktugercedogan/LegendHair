import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#080706",
        gold: "#c8a24a",
        "gold-soft": "#ead79c",
        ivory: "#fffaf0",
        pearl: "#fbfaf7"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 18px 60px rgba(200, 162, 74, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
