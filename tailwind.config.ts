import type { Config } from "tailwindcss";

// Tailwind is enabled for convenience, but the warm "paper" design system lives
// as CSS custom properties + component classes in src/index.css (ported 1:1 from
// the original prototype) so the look stays pixel-faithful.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        brand: "var(--brand)",
      },
      fontFamily: {
        display: ["'Baloo 2'", "cursive"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
