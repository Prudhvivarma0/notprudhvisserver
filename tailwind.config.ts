import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:          "var(--bg)",
        ink:         "var(--ink)",
        mute:        "var(--mute)",
        rule:        "var(--rule)",
        "invert-bg": "var(--invert-bg)",
        "invert-ink":"var(--invert-ink)",
      },
      fontFamily: {
        display: ["var(--font-anton)", "Anton", "Bebas Neue", "Impact", "sans-serif"],
        sans:    ["var(--font-inter-tight)", "Inter Tight", "system-ui", "sans-serif"],
        mono:    ["var(--font-jetbrains)", "JetBrains Mono", "ui-monospace", "monospace"],
        serif:   ["var(--font-instrument)", "Instrument Serif", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
