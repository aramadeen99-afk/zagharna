import type { Config } from "tailwindcss";

// نظام الألوان والخطوط الخاص بهوية "عائلة الزغارنة"
// راجع src/config/site.config.ts لأي تعديل على الهوية دون لمس الكود
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        charcoal: { DEFAULT: "#15130f", 2: "#1d1a14" },
        ivory: { DEFAULT: "#f6f1e4", dim: "#d8d2c1" },
        gold: { DEFAULT: "#c8a24a", light: "#e4c878" },
        green: { DEFAULT: "#173a2c", light: "#265640" },
      },
      fontFamily: {
        kufi: ["var(--font-kufi)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        sm: "3px",
        md: "5px",
      },
    },
  },
  plugins: [],
};

export default config;
