import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        ink: "#F0EDE8",
        paper: "#0D0D0D",
        surface: "#171717",
        surface2: "#1F1F1F",
        border: "#2A2A2A",
        border2: "#333333",
        // raised from #666660, which failed WCAG AA on every surface
        muted: "#8A8A82",
        accent: "#3B82F6",
        good: "#34D399",
        warn: "#F59E0B",
        danger: "#EF4444",
      },
      keyframes: {
        "border-beam": {
          "100%": { offsetDistance: "100%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "150% 0" },
          "100%": { backgroundPosition: "-150% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        shimmer: "shimmer 2.4s linear infinite",
        "fade-up": "fade-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;