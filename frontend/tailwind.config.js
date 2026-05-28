/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#fff5f0",
          100: "#ffe8da",
          200: "#ffd0b3",
          300: "#ffaf80",
          400: "#ff8247",
          500: "#e85d1a",
          600: "#c94a0f",
          700: "#a83a0d",
          800: "#8a2f11",
          900: "#722912",
        },
        brand: {
          red:    "#C0392B",
          orange: "#E67E22",
          dark:   "#2C1810",
          light:  "#FDF6F0",
          stone:  "#8B7355",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body:    ["'Inter'", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up":   "fadeUp 0.6s ease-out forwards",
        "fade-in":   "fadeIn 0.5s ease-out forwards",
        "slide-in":  "slideIn 0.5s ease-out forwards",
        float:       "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:  { "0%": { opacity: 0, transform: "translateY(30px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        fadeIn:  { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideIn: { "0%": { opacity: 0, transform: "translateX(-20px)" }, "100%": { opacity: 1, transform: "translateX(0)" } },
        float:   { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
