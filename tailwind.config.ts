import { type Config } from "tailwindcss";
import theme, { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      boxShadow: {
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
      },
      dropShadow: {
        glow: [
          "0 0px 20px rgba(254,165,4, 0.9)",
          "0 0px 150px rgba(254,255,255, 0.8)",
        ],
      },
      backgroundImage: {
        "polka-pattern": "url('/landing-bg.svg')",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["bumblebee", "forest"],
    base: true,
    styled: true,
    utils: true,
  },
} satisfies Config;
