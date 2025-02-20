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
        primary: {
          DEFAULT: "#2AD07F",
        },
        error: {
          DEFAULT: "#EB5659",
        },
        input: {
          DEFAULT: "#224957",
        },
        card: {
          DEFAULT: "#082D39",
        },
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      fontSize: {
        "heading-one": ["64px", { lineHeight: "80px", letterSpacing: "0%" }],
        "heading-two": ["48px", { lineHeight: "56px", letterSpacing: "0%" }],
        "heading-three": ["32px", { lineHeight: "40px", letterSpacing: "0%" }],
        "heading-four": ["24px", { lineHeight: "32px", letterSpacing: "0%" }],
        "heading-five": ["20px", { lineHeight: "24px", letterSpacing: "0%" }],
        "heading-six": ["16px", { lineHeight: "24px", letterSpacing: "0%" }],
        "body-large": ["20px", { lineHeight: "32px", letterSpacing: "0%" }],
        "body-regular": ["16px", { lineHeight: "24px", letterSpacing: "0%" }],
        "body-small": ["14px", { lineHeight: "24px", letterSpacing: "0%" }],
        "body-extra-small": [
          "12px",
          { lineHeight: "24px", letterSpacing: "0%" },
        ],
        caption: ["14px", { lineHeight: "16px", letterSpacing: "0%" }],
      },
      fontWeight: {
        bold: "700",
        semibold: "600",
        regular: "400",
      },
    },
  },
  plugins: [],
} satisfies Config;
