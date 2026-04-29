import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#08111f",
        indigoInk: "#0d1530",
        magenta: "#ec4899",
        violetGlow: "#8b5cf6",
        cyanGlow: "#38bdf8",
        mintGlow: "#34d399"
      },
      boxShadow: {
        glow: "0 18px 60px rgba(15, 23, 42, 0.5)"
      }
    }
  },
  plugins: []
} satisfies Config;
