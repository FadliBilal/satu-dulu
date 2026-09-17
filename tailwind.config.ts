import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        satubg: {
          light: "#F8FAFC",
          dark: "#0B0F17",
          subtle: "#F1F5F9",
          subtledark: "#131C2E",
        },
        satutext: {
          primary: "#0F172A",
          secondary: "#475569",
          muted: "#94A3B8",
          lightprimary: "#F8FAFC",
          lightsecondary: "#CBD5E1",
        },
        satublue: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1E40AF",
          800: "#1E3A8A",
          900: "#172554",
        },
        satuaccent: {
          DEFAULT: "#1E3A8A",
          hover: "#1D4ED8",
          active: "#172554",
          subtle: "#EFF6FF",
        },
        satusuccess: {
          DEFAULT: "#059669",
          subtle: "#ECFDF5",
          border: "#A7F3D0",
        },
        satuwarning: {
          DEFAULT: "#D97706",
          subtle: "#FFFBEB",
          border: "#FDE68A",
        },
        satudanger: {
          DEFAULT: "#DC2626",
          subtle: "#FEF2F2",
          border: "#FECACA",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        wide: "0.04em",
        wider: "0.08em",
        widest: "0.12em",
      },
    },
  },
  plugins: [],
};
export default config;
