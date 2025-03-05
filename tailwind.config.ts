import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#F2B420",
        secondary: "#FEFBF4",
        customGray: "#D9D9D9",
        primaryLight: "#FCF0D2",
        lightYellow: "#FEECD2",
        orangeYellow: "#ED761C",
        customYellow: "#F3B420",
        groundGray: "#F8F9FA",
      },
      fontFamily: {
        sans: ["Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
