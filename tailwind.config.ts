import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FBF6EC",
        paper: "#FFFDF9",
        maroon: {
          DEFAULT: "#5C1A28",
          dark: "#3E0F19",
          light: "#7A2638",
        },
        gold: {
          DEFAULT: "#BF9B4F",
          light: "#E4C77E",
          dark: "#8F7233",
        },
        ink: "#241813",
        terracotta: "#A8524A",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "arch-pattern":
          "radial-gradient(circle at 50% 0%, rgba(191,155,79,0.12), transparent 60%)",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(36,24,19,0.25)",
      },
      borderRadius: {
        arch: "999px 999px 8px 8px",
      },
    },
  },
  plugins: [],
};
export default config;
